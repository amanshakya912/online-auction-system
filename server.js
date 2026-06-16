const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const productDetailRoutes = require('./routes/productDetailRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { initSocket } = require('./socket');
const Product = require('./models/Product');
const User = require('./models/User');
const { sendEmail } = require('./mail/sendEmail');
const { getIo } = require('./socket');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const app = express();

// CORS configuration — restrict to known origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Stripe webhook must use raw body — register before express.json()
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "api.stripe.com"],
      frameSrc: ["js.stripe.com"],
      objectSrc: ["'none'"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}));
app.disable('x-powered-by');

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', productDetailRoutes);
app.use('/api', paymentRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminRoutes);
app.get('/', (req, res) => {
  res.json({ mssg: 'welcome' })
})
app.use('/uploads', express.static('uploads'));

// Centralized error handling middleware
app.use(errorHandler);

const server = http.createServer(app);
initSocket(server);

// Server-side auction end scheduler — checks every 60 seconds
const checkExpiredAuctions = async () => {
  try {
    const now = new Date();
    const expiredAuctions = await Product.find({
      status: 'Available',
      auctionEndTime: { $lte: now },
    });

    for (const product of expiredAuctions) {
      if (product.activeBidders && product.activeBidders.length > 0) {
        const winningBidder = product.activeBidders[product.activeBidders.length - 1];
        product.finalPrice = product.currentBid;
        product.boughtBy = winningBidder;
        product.status = 'Sold';

        // Send auction won email (non-blocking)
        try {
          const winner = await User.findById(winningBidder);
          if (winner && winner.email) {
            sendEmail(winner.email, 'Congratulations! You Won an Auction', 'auctionWon', {
              productName: product.name,
              finalPrice: product.finalPrice,
            });
          }
        } catch (emailErr) {
          // Email failure should not stop the scheduler
        }
      } else {
        product.status = 'Withdrawn';
      }

      try {
        await product.save();
      } catch (saveErr) {
        console.warn('Skipping product %s — save failed:', product._id, saveErr.message);
        continue;
      }

      // Emit socket event
      try {
        const io = getIo();
        io.emit('auctionEnded', {
          productId: product._id,
          finalPrice: product.finalPrice,
          status: product.status,
          boughtBy: product.boughtBy,
        });
      } catch (socketErr) {
        // Socket failure should not stop the scheduler
      }
    }
  } catch (error) {
    console.error('Auction scheduler error:', error.message);
  }
};

// Run auction check every 60 seconds
setInterval(checkExpiredAuctions, 60 * 1000);

server.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
});
