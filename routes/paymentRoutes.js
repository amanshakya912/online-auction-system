const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/payment/create-intent — requires auth
// Uses express.json() body parser (applied globally in server.js)
router.post('/payment/create-intent', authMiddleware, paymentController.createPaymentIntent);

// Compatibility alias used by older frontend code.
router.post('/payments/create-intent', authMiddleware, paymentController.createPaymentIntent);

// POST /api/webhooks/stripe — NO auth, NO CSRF
// Raw body parsing is configured in server.js before express.json() for this path
router.post(
  '/webhooks/stripe',
  paymentController.handleWebhook
);

module.exports = router;
