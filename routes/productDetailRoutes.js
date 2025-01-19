const express = require('express')
const router = express.Router();
const productDetailController = require('../controllers/productDetailController');

router.post('/product-detail/add', productDetailController.addProductDetail);
router.get('/product-detail/:id', productDetailController.getProductDetailById);
module.exports = router;