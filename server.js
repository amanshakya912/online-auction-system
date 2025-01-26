const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const productDetailRoutes = require('./routes/productDetailRoutes');
const { initSocket } = require('./socket'); // Import initSocket

dotenv.config();

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cors({
  origin: '*' // Replace '*' with specific domains if needed
}));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', productDetailRoutes);
app.get('/', (req, res) => {
  res.json({mssg: 'welcome'})
})
app.use('/uploads', express.static('uploads'));
const server = http.createServer(app); // Create server
initSocket(server); // Initialize socket.io with the server

server.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
});
