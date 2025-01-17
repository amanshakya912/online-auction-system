const express = require('express')
const cors = require("cors");
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');


dotenv.config(); // Load environment variables from .env file

const app = express()

//for dev 
app.use(cors());

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
app.use('/uploads', express.static('uploads'));

app.use('/api', productRoutes);
app.use('/api', userRoutes);

app.listen(4000, () => {
    console.log('Listening')
})