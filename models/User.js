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
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
        select: false,
    },
    emailVerificationExpiry: {
        type: Date,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isSuspended: {
        type: Boolean,
        default: false,
    },
    suspendedAt: {
        type: Date,
    },
    suspendedReason: {
        type: String,
    },
}, {timestamps: true})

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ isSuspended: 1 });

module.exports = mongoose.model('User', userSchema);
