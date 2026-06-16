const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleWare');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateProduct, validateBid } = require('../middlewares/validationMiddleware');
const requireNotSuspended = require('../middlewares/suspensionMiddleware');

// Protected routes (require authentication)
router.post('/add-product', authMiddleware, requireNotSuspended, upload.array('images', 5), validateProduct, productController.addProduct)
router.put('/product/:id', authMiddleware, productController.editProduct);
router.delete('/product/:id', authMiddleware, productController.deleteProduct);
router.post('/product/placeBid', authMiddleware, requireNotSuspended, validateBid, productController.placeBid); 
router.post('/end-auction/:productId', authMiddleware, productController.endAuction);
router.post('/buy-now/:productId', authMiddleware, productController.buyNow);

// Public routes
router.get('/products', productController.getProducts)
router.get('/product/:slug', productController.getProductBySlug);
router.get('/products/user/:userId', productController.getProductsByUser);

module.exports = router;
