const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleWare');

router.post('/add-product',  upload.array('images', 5), productController.addProduct)
router.put('/product/:id', productController.editProduct);
router.delete('/product/:id', productController.deleteProduct);
router.get('/products', productController.getProducts)

router.get('/product/:slug', productController.getProductBySlug);

router.post('/product/placeBid', productController.placeBid); 
router.get('/products/user/:userId', productController.getProductsByUser);

router.post('/end-auction/:productId', productController.endAuction);
router.post('/buy-now/:productId', productController.buyNow);

module.exports = router;