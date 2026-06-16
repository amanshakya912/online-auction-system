const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateShippingAddress } = require('../middlewares/validationMiddleware');

// POST /api/checkout/initiate — requires auth + CSRF
router.post('/checkout/initiate', authMiddleware, checkoutController.initiateCheckout);

// POST /api/checkout/complete — requires auth + shipping address validation + CSRF
router.post('/checkout/complete', authMiddleware, validateShippingAddress, checkoutController.completeCheckout);

module.exports = router;
