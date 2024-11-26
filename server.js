const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const productRoutes = require('./routes/productRoutes');

dotenv.config(); // Load environment variables from .env file

const app = express()

app.use(express.json());

// console.log(process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get('/', (req, res) => {
    res.json({mssg: 'welcome'})
})

app.use('/api', productRoutes);

app.listen(4000, () => {
    console.log('Listening')
})