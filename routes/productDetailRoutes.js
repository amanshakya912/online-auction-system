const express = require('express')
const router = express.Router();
const productDetailController = require('../controllers/productDetailController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireNotSuspended = require('../middlewares/suspensionMiddleware');

router.post('/product-detail/add', authMiddleware, requireNotSuspended, productDetailController.addProductDetail);
router.get('/product-detail/:id', productDetailController.getProductDetailById);
module.exports = router;
