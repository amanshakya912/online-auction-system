const mongoose = require('mongoose');

const adminActivitySchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        enum: [
            'suspend_user',
            'activate_user',
            'reset_password',
            'end_auction_early',
            'flag_suspicious_activity',
            'view_user',
            'view_auction',
            'view_dashboard',
        ],
        required: true,
    },
    targetType: {
        type: String,
        enum: ['user', 'auction', 'order', 'system'],
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
        type: String,
        trim: true,
    },
    userAgent: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

// Indexes
adminActivitySchema.index({ adminId: 1, createdAt: -1 });
adminActivitySchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('AdminActivity', adminActivitySchema);
