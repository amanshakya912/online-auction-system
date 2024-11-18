const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config(); // Load environment variables from .env file

const app = express()

console.log(process.env.MONGO_URI);

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

app.listen(4000, () => {
    console.log('Listening')
})