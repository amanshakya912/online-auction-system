const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const AdminActivity = require('../models/AdminActivity');
const { sendEmail } = require('../mail/sendEmail');
const { getIo } = require('../socket');
const PaginationHelper = require('../utils/pagination');

// Helper to log admin actions without blocking the response
async function logAdminActivity(adminId, action, targetType, targetId, details, req) {
    try {
        await AdminActivity.create({
            adminId,
            action,
            targetType,
            targetId,
            details,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });
    } catch (_) {}
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

exports.getDashboardMetrics = async (req, res) => {
    try {
        const [activeAuctions, totalUsers, revenueResult, recentOrders] = await Promise.all([
            Product.countDocuments({ status: 'Available' }),
            User.countDocuments(),
            Order.aggregate([
                { $match: { status: { $in: ['paid', 'delivered'] } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            Order.find({ status: { $in: ['paid', 'delivered'] } })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('productId', 'name')
                .populate('buyerId', 'userName'),
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const formattedOrders = recentOrders.map((order) => ({
            _id: order._id,
            productName: order.productId ? order.productId.name : null,
            buyerUsername: order.buyerId ? order.buyerId.userName : null,
            amount: order.amount,
            status: order.status,
            createdAt: order.createdAt,
        }));

        res.status(200).json({
            activeAuctions,
            totalUsers,
            totalRevenue,
            recentOrders: formattedOrders,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dashboard metrics', message: 'Server error. Please try again.' });
    }
};

// ─── User Management ──────────────────────────────────────────────────────────

exports.getUsers = async (req, res) => {
    try {
        const { search, status, page, limit } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if (status === 'suspended') filter.isSuspended = true;
        else if (status === 'active') filter.isSuspended = false;

        const result = await PaginationHelper.getPaginatedResponse(
            User,
            filter,
            page,
            limit,
            { createdAt: -1 }
        );

        const users = result.data.map((u) => ({
            _id: u._id,
            userName: u.userName,
            email: u.email,
            createdAt: u.createdAt,
            isSuspended: u.isSuspended,
            role: u.role,
        }));

        res.status(200).json({ data: users, pagination: result.pagination });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users', message: 'Server error. Please try again.' });
    }
};

exports.suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { isSuspended: true, suspendedAt: new Date(), suspendedReason: reason || '' },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });

        logAdminActivity(req.user.id, 'suspend_user', 'user', user._id, { reason: reason || '' }, req);

        res.status(200).json({ message: 'User suspended successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error suspending user', message: 'Server error. Please try again.' });
    }
};

exports.activateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { isSuspended: false, $unset: { suspendedAt: '', suspendedReason: '' } },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });

        logAdminActivity(req.user.id, 'activate_user', 'user', user._id, {}, req);

        res.status(200).json({ message: 'User activated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error activating user', message: 'Server error. Please try again.' });
    }
};

exports.getUserActivity = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const [createdAuctions, bidHistory] = await Promise.all([
            Product.find({ createdBy: userId }).sort({ createdAt: -1 }),
            Product.find({ activeBidders: userId }).sort({ createdAt: -1 }),
        ]);

        logAdminActivity(req.user.id, 'view_user', 'user', user._id, { action: 'view_activity' }, req);

        res.status(200).json({ createdAuctions, bidHistory });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user activity', message: 'Server error. Please try again.' });
    }
};

exports.resetUserPassword = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const tempPassword = crypto.randomBytes(8).toString('hex');
        const hashed = await bcrypt.hash(tempPassword, 10);

        user.password = hashed;
        await user.save();

        logAdminActivity(req.user.id, 'reset_password', 'user', user._id, {}, req);

        res.status(200).json({ message: 'Password reset successfully', tempPassword });
    } catch (error) {
        res.status(500).json({ error: 'Error resetting password. Please try again.' });
    }
};

// ─── Auction Monitoring ───────────────────────────────────────────────────────

exports.getAdminAuctions = async (req, res) => {
    try {
        const { search, status, page, limit } = req.query;
        const filter = {};

        if (status) filter.status = status;

        const maxLimit = 100;
        const sanitizedLimit = Math.min(Math.max(1, parseInt(limit) || 20), maxLimit);
        const sanitizedPage = Math.max(1, parseInt(page) || 1);
        const skip = (sanitizedPage - 1) * sanitizedLimit;

        // For seller search, find matching user IDs first
        let sellerIds = [];
        if (search) {
            const matchingUsers = await User.find(
                { userName: { $regex: search, $options: 'i' } },
                '_id'
            );
            sellerIds = matchingUsers.map((u) => u._id);
        }

        // Combine filters: match by product name OR by seller
        const combinedFilter = { ...filter };
        if (search) {
            combinedFilter.$or = [
                { name: { $regex: search, $options: 'i' } },
                ...(sellerIds.length > 0 ? [{ createdBy: { $in: sellerIds } }] : []),
            ];
        }

        const [products, total] = await Promise.all([
            Product.find(combinedFilter)
                .populate('createdBy', 'userName email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(sanitizedLimit),
            Product.countDocuments(combinedFilter),
        ]);

        const now = new Date();
        const auctions = products.map((p) => {
            const msRemaining = p.auctionEndTime ? p.auctionEndTime - now : 0;
            const timeRemaining = msRemaining > 0 ? Math.floor(msRemaining / 1000) : 0; // seconds
            return {
                _id: p._id,
                name: p.name,
                seller: p.createdBy ? { _id: p.createdBy._id, userName: p.createdBy.userName } : null,
                currentBid: p.currentBid,
                numberOfBids: p.numberOfBids,
                auctionEndTime: p.auctionEndTime,
                timeRemaining,
                status: p.status,
                isFlagged: p.isFlagged,
            };
        });

        res.status(200).json({
            data: auctions,
            pagination: {
                total,
                page: sanitizedPage,
                limit: sanitizedLimit,
                totalPages: Math.ceil(total / sanitizedLimit),
                hasNextPage: sanitizedPage * sanitizedLimit < total,
                hasPrevPage: sanitizedPage > 1,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching auctions', message: 'Server error. Please try again.' });
    }
};

exports.getAuctionDetails = async (req, res) => {
    try {
        const { auctionId } = req.params;

        const product = await Product.findById(auctionId)
            .populate('activeBidders', 'userName email')
            .populate('createdBy', 'userName email')
            .populate('boughtBy', 'userName email');

        if (!product) return res.status(404).json({ error: 'Auction not found' });

        const now = new Date();
        const msRemaining = product.auctionEndTime ? product.auctionEndTime - now : 0;
        const timeRemaining = msRemaining > 0 ? Math.floor(msRemaining / 1000) : 0;

        const response = {
            _id: product._id,
            name: product.name,
            description: product.description,
            images: product.images,
            category: product.category,
            startingPrice: product.startingPrice,
            currentBid: product.currentBid,
            numberOfBids: product.numberOfBids,
            bidIncrement: product.bidIncrement,
            auctionStartTime: product.auctionStartTime,
            auctionEndTime: product.auctionEndTime,
            timeRemaining,
            status: product.status,
            isFlagged: product.isFlagged,
            finalPrice: product.finalPrice,
            seller: product.createdBy,
            bidders: product.activeBidders,
            winner: product.boughtBy || null,
            createdAt: product.createdAt,
        };

        logAdminActivity(req.user.id, 'view_auction', 'auction', product._id, {}, req);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching auction details', message: 'Server error. Please try again.' });
    }
};

exports.endAuctionEarly = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const { reason } = req.body;

        const product = await Product.findById(auctionId)
            .populate('activeBidders', 'email userName')
            .populate('createdBy', 'email userName');

        if (!product) return res.status(404).json({ error: 'Auction not found' });

        if (product.status !== 'Available') {
            return res.status(400).json({ error: 'Auction is not active' });
        }

        const hasBidders = product.activeBidders && product.activeBidders.length > 0;
        product.status = hasBidders ? 'Sold' : 'Withdrawn';

        if (hasBidders) {
            const winner = product.activeBidders[product.activeBidders.length - 1];
            product.finalPrice = product.currentBid;
            product.boughtBy = winner._id;
        }

        await product.save();

        // Notify seller
        try {
            if (product.createdBy && product.createdBy.email) {
                sendEmail(
                    product.createdBy.email,
                    'Your Auction Has Been Ended Early',
                    'auctionEndedEarly',
                    { productName: product.name, reason: reason || 'Administrative action' }
                );
            }
        } catch (_) {}

        // Notify all bidders
        for (const bidder of product.activeBidders) {
            try {
                if (bidder.email) {
                    sendEmail(
                        bidder.email,
                        'Auction Ended Early',
                        'auctionEndedEarly',
                        { productName: product.name, reason: reason || 'Administrative action' }
                    );
                }
            } catch (_) {}
        }

        // Emit socket event
        try {
            const io = getIo();
            io.emit('auctionEnded', {
                productId: product._id,
                finalPrice: product.finalPrice,
                status: product.status,
                boughtBy: product.boughtBy,
                reason,
            });
        } catch (_) {}

        logAdminActivity(req.user.id, 'end_auction_early', 'auction', product._id, { reason: reason || 'Administrative action' }, req);

        res.status(200).json({ message: 'Auction ended early', product });
    } catch (error) {
        res.status(500).json({ error: 'Error ending auction. Please try again.' });
    }
};

exports.flagSuspiciousActivity = async (req, res) => {
    try {
        const { auctionId } = req.params;

        const product = await Product.findByIdAndUpdate(
            auctionId,
            { isFlagged: true },
            { new: true }
        );

        if (!product) return res.status(404).json({ error: 'Auction not found' });

        logAdminActivity(req.user.id, 'flag_suspicious_activity', 'auction', product._id, {}, req);

        // Emit real-time admin notification
        try {
            const io = getIo();
            io.emit('auctionFlagged', {
                productId: product._id,
                name: product.name,
                isFlagged: true,
            });
        } catch (_) {}

        res.status(200).json({ message: 'Auction flagged for suspicious activity', product });
    } catch (error) {
        res.status(500).json({ error: 'Error flagging auction', message: 'Server error. Please try again.' });
    }
};
