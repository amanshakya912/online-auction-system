require('dotenv').config(); // This must be at the top

const mongoose = require('mongoose');
const Product = require('../models/Product');

async function dropProductIdIndex() {
    try {
        // Connect to MongoDB using the connection string from the .env file
        mongoose.connect(process.env.MONGO_URI)


        // Drop the index (replace 'productId_1' with the actual index name if necessary)
        await Product.collection.dropIndex('productId_1');
        console.log('Index dropped successfully');
    } catch (error) {
        console.error('Error dropping index:', error);
    } finally {
        mongoose.connection.close(); // Close the connection to MongoDB
    }
}

dropProductIdIndex();
