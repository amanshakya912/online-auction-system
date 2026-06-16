const stripe = require('../config/stripe');
const Order = require('../models/Order');

exports.createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe is not configured for this demo. Add STRIPE_SECRET_KEY to enable real test payments.',
      });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. This order does not belong to you.' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ error: 'Order has already been paid' });
    }

    // Amount in smallest currency unit (paise for INR, cents for USD, etc.)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.amount * 100),
      currency: 'inr',
      metadata: {
        orderId: order._id.toString(),
        buyerId: order.buyerId.toString(),
      },
    });

    // Store the payment intent ID on the order
    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('createPaymentIntent error:', error.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

exports.handleWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await processPaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await processPaymentFailure(event.data.object);
        break;
      default:
        // Unhandled event type — ignore
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.json({ received: true });
};

const processPaymentSuccess = async (paymentIntent) => {
  const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });

  if (!order) {
    console.error(`processPaymentSuccess: No order found for paymentIntentId ${paymentIntent.id}`);
    return;
  }

  order.status = 'paid';
  order.statusHistory.push({
    status: 'paid',
    changedAt: new Date(),
    note: `Payment confirmed via Stripe. PaymentIntent: ${paymentIntent.id}`,
  });

  await order.save();
};

const processPaymentFailure = async (paymentIntent) => {
  const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });

  if (!order) {
    console.error(`processPaymentFailure: No order found for paymentIntentId ${paymentIntent.id}`);
    return;
  }

  // Keep status as 'pending' to allow retry
  const failureMessage = paymentIntent.last_payment_error
    ? paymentIntent.last_payment_error.message
    : 'Payment failed';

  console.error(
    `Payment failed for order ${order._id} (PaymentIntent: ${paymentIntent.id}): ${failureMessage}`
  );
};
