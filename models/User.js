const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false,
    },
    googleId: {
        type: String, 
        unique: true,
        sparse: true,
    },
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);
