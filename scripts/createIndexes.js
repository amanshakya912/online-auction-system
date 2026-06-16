require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

async function createIndexes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Product.createIndexes();
        console.log('Product indexes created successfully');

        await User.createIndexes();
        console.log('User indexes created successfully');

        await Order.createIndexes();
        console.log('Order indexes created successfully');

        console.log('All indexes created successfully');
    } catch (error) {
        console.error('Error creating indexes:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createIndexes();
