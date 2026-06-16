const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Validates a shipping address object.
 * @param {Object} address
 * @returns {{ valid: boolean, errors?: string[] }}
 */
exports.validateShippingAddress = (address) => {
  const requiredFields = ['street', 'city', 'state', 'postalCode', 'country'];
  const errors = [];

  for (const field of requiredFields) {
    if (!address || !address[field] || String(address[field]).trim() === '') {
      errors.push(`${field} is required`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
};

/**
 * GET checkout summary for a won auction product.
 * Requires: req.body.productId, req.user.id
 */
exports.initiateCheckout = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    if (product.status !== 'Sold') {
      return res.status(400).json({ error: 'Product is not available for checkout' });
    }

    if (!product.boughtBy || product.boughtBy.toString() !== req.user.id) {
      return res.status(400).json({ error: 'You are not the buyer of this product' });
    }

    return res.json({
      name: product.name,
      finalPrice: product.finalPrice,
      image: product.images[0] || null,
    });
  } catch (error) {
    console.error('initiateCheckout error:', error.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

/**
 * POST complete checkout — creates an Order document.
 * Requires: req.body.productId, req.body.shippingAddress, req.user.id
 */
exports.completeCheckout = async (req, res) => {
  try {
    const { productId } = req.body;
    const shippingAddress = {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country,
    };

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const validation = exports.validateShippingAddress(shippingAddress);
    if (!validation.valid) {
      return res.status(400).json({ error: 'Invalid shipping address', errors: validation.errors });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    if (product.status !== 'Sold') {
      return res.status(400).json({ error: 'Product is not available for checkout' });
    }

    if (!product.boughtBy || product.boughtBy.toString() !== req.user.id) {
      return res.status(400).json({ error: 'You are not the buyer of this product' });
    }

    const order = await Order.create({
      productId: product._id,
      buyerId: req.user.id,
      sellerId: product.createdBy,
      amount: product.finalPrice,
      shippingAddress,
      status: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order created' }],
    });

    return res.status(201).json({ orderId: order._id, order });
  } catch (error) {
    console.error('completeCheckout error:', error.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
