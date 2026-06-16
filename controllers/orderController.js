const Order = require('../models/Order');
const User = require('../models/User');
const { getIo } = require('../socket');

/**
 * GET /api/orders
 * Returns paginated orders for the authenticated user (as buyer).
 * Query params: status, page, limit
 */
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    const maxLimit = 100;
    const sanitizedLimit = Math.min(Math.max(1, parseInt(limit)), maxLimit);
    const sanitizedPage = Math.max(1, parseInt(page));
    const skip = (sanitizedPage - 1) * sanitizedLimit;

    const filter = { buyerId: userId };
    if (status) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(sanitizedLimit)
        .populate('productId', 'name images'),
      Order.countDocuments(filter),
    ]);

    // Expose only the first image for list view
    const ordersWithImage = orders.map((order) => {
      const obj = order.toObject();
      if (obj.productId && Array.isArray(obj.productId.images)) {
        obj.productId.images = obj.productId.images.slice(0, 1);
      }
      return obj;
    });

    return res.json({
      orders: ordersWithImage,
      pagination: {
        total,
        page: sanitizedPage,
        limit: sanitizedLimit,
        totalPages: Math.ceil(total / sanitizedLimit),
      },
    });
  } catch (error) {
    console.error('getOrders error:', error.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

/**
 * GET /api/orders/:orderId
 * Returns full order details. Accessible by buyer or seller.
 */
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate('productId', 'name images description')
      .populate('sellerId', 'userName');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const isBuyer = order.buyerId.toString() === userId;
    const isSeller = order.sellerId && order.sellerId._id
      ? order.sellerId._id.toString() === userId
      : order.sellerId.toString() === userId;

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.json({ order });
  } catch (error) {
    console.error('getOrderById error:', error.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

/**
 * PATCH /api/orders/:orderId/status
 * Updates order status.
 * - Sellers can update to 'shipped' or 'delivered'
 * - Admins can update to 'cancelled'
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const isSeller = order.sellerId.toString() === userId;
    const currentUser = await User.findById(userId).select('role');
    const isAdmin = currentUser?.role === 'admin';

    const sellerAllowedStatuses = ['shipped', 'delivered'];
    const adminAllowedStatuses = ['cancelled'];

    if (isSeller && sellerAllowedStatuses.includes(status)) {
      // Seller updating to shipped or delivered — allowed
    } else if (isAdmin && adminAllowedStatuses.includes(status)) {
      // Admin cancelling — allowed
    } else {
      return res.status(403).json({ error: 'You are not authorized to set this status' });
    }

    order.status = status;
    order.statusHistory.push({ status, changedAt: new Date() });
    await order.save();

    // Emit real-time order status update
    try {
      const io = getIo();
      io.emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.status,
        buyerId: order.buyerId,
      });
    } catch (_) {}

    return res.json({ order });
  } catch (error) {
    console.error('updateOrderStatus error:', error.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
