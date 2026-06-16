const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        required: true,
    },
    changedAt: { type: Date, default: Date.now },
    note: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be non-negative'],
    },
    stripePaymentIntentId: {
        type: String,
        trim: true,
    },
    shippingAddress: {
        type: shippingAddressSchema,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    statusHistory: {
        type: [statusHistorySchema],
        default: [],
    },
}, { timestamps: true });

// Indexes
orderSchema.index({ buyerId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
