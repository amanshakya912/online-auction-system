const Product = require('../models/Product');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const { sendEmail }  = require('../mail/sendEmail');
const { getIo } = require('../socket');
const PaginationHelper = require('../utils/pagination');

const canManageProduct = async (product, userId) => {
    if (!product || !userId) return false;
    if (product.createdBy && product.createdBy.toString() === userId.toString()) {
        return true;
    }

    const user = await User.findById(userId).select('role');
    return user?.role === 'admin';
};

const getIdString = (value) => {
    if (!value) return null;
    return value._id ? value._id.toString() : value.toString();
};

exports.addProduct = async (req, res) => {
    const { name, description, quantity, startingPrice, buyNowPrice, bidIncrement, auctionStartTime, auctionEndTime, category, productDetailId } = req.body;
    
    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    const imagePaths = uploadedFiles.map((file) => `/uploads/${file.filename}`);

    const requiredFields = [
        { name: 'name', value: name },
        { name: 'quantity', value: quantity},
        { name: 'startingPrice', value: startingPrice },
        { name: 'buyNowPrice', value: buyNowPrice },
        { name: 'bidIncrement', value: bidIncrement },
        { name: 'auctionStartTime', value: auctionStartTime },
        { name: 'auctionEndTime', value: auctionEndTime },
        { name: 'category', value: category },
        { name: 'productDetailId', value: productDetailId },
    ];

    const missingFields = requiredFields
        .filter(field => !field.value)
        .map(field => field.name);

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
    if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: 'At least one image is required' });
    }
    try {
        const newProduct = new Product({
            name,
            description,
            quantity,
            startingPrice,
            buyNowPrice,
            bidIncrement,
            auctionStartTime,
            auctionEndTime,
            category,
            images: imagePaths,
            status: 'Available',
            createdBy: req.user.id,
            details: productDetailId
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: 'Your auction has been listed successfully!',
            data: savedProduct
        });
    } catch (error) {
        res.status(500).json({ error: 'Error adding product. Please try again later.' });
    }
};

exports.editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, quantity, startingPrice, buyNowPrice, bidIncrement, category, images, auctionStartTime, auctionEndTime } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!(await canManageProduct(product, req.user.id))) {
            return res.status(403).json({ error: 'You are not allowed to edit this product' });
        }

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.quantity = quantity ?? product.quantity;
        product.startingPrice = startingPrice ?? product.startingPrice;
        product.buyNowPrice = buyNowPrice ?? product.buyNowPrice;
        product.bidIncrement = bidIncrement ?? product.bidIncrement;
        product.category = category ?? product.category;
        product.images = images ?? product.images;
        product.auctionStartTime = auctionStartTime ?? product.auctionStartTime;
        product.auctionEndTime = auctionEndTime ?? product.auctionEndTime;

        const updatedProduct = await product.save();
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    try {
        const product = await Product.findById(id);
  
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!(await canManageProduct(product, req.user.id))) {
            return res.status(403).json({ error: 'You are not allowed to delete this product' });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        // Clean up uploaded image files
        if (deletedProduct.images && deletedProduct.images.length > 0) {
            deletedProduct.images.forEach(imagePath => {
                const fullPath = path.join(__dirname, '..', imagePath);
                fs.unlink(fullPath, (err) => {
                    if (err) console.error('Error deleting image:', fullPath);
                });
            });
        }
  
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { page, limit, status, category } = req.query;
        const filter = {};
        if (typeof status === 'string') filter.status = status;
        if (typeof category === 'string') filter.category = category;

        const result = await PaginationHelper.getPaginatedResponse(
            Product,
            filter,
            page,
            limit,
            { createdAt: -1 }
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

exports.getProductBySlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const product = await Product.findOne({ slug });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.placeBid = async (req, res) => {
    const { productId, bidAmount } = req.body;
    const userId = req.user.id;

    try {
        const product = await Product.findById(productId).populate('activeBidders', 'email');

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        if (product.status !== 'Available') {
            return res.status(400).json({ error: 'Auction is not available for bidding.' });
        }

        if (product.createdBy && product.createdBy.toString() === userId.toString()) {
            return res.status(400).json({ error: 'You cannot bid on your own auction.' });
        }

        const currentTime = Date.now();
        if (product.auctionEndTime < currentTime) {
            return res.status(400).json({ error: 'Auction has ended.' });
        }

        const validBidAmount = product.numberOfBids > 0
            ? product.currentBid + product.bidIncrement
            : product.startingPrice;

        if (bidAmount < validBidAmount) {
            return res.status(400).json({ error: `Bid must be at least Rs. ${validBidAmount}` });
        }

        product.currentBid = bidAmount;
        product.numberOfBids += 1;

        if (!Array.isArray(product.activeBidders)) {
            product.activeBidders = [];
        }
        
        product.activeBidders = product.activeBidders.filter(Boolean);
        
        if (!product.activeBidders.some(bidder => getIdString(bidder) === userId.toString())) {
            product.activeBidders.push(userId);
        }

        const updatedProduct = await product.save();
        const io = getIo();
        io.emit('bidUpdated', {
            productId,
            currentBid: product.currentBid,
            activeBidders: product.activeBidders,
            bidderId: userId,
            numberOfBids: product.numberOfBids
        });

        res.status(200).json({
            message: 'Bid placed successfully!',
            product: updatedProduct
        });

        // Send email notification to product creator (non-blocking)
        try {
            const creator = await User.findById(product.createdBy);
            if (creator && creator.email) {
                sendEmail(creator.email, 'New Bid on Your Product', 'bidPlaced', {
                    bidAmount,
                    productName: product.name,
                });
            }
        } catch (emailErr) {
            // Email failure should not affect bid response
        }
    } catch (error) {
        res.status(500).json({ error: 'Error placing the bid. Please try again later.' });
    }
};


exports.getProductsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page, limit } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Valid User ID is required.' });
        }

        const result = await PaginationHelper.getPaginatedResponse(
            Product,
            { createdBy: userId },
            page,
            limit,
            { createdAt: -1 },
            { path: 'createdBy', select: 'username email' }
        );

        if (result.pagination.total === 0) {
            return res.status(404).json({ message: 'No products found for this user.' });
        }

        res.status(200).json({
            message: 'Products fetched successfully.',
            ...result,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};


exports.endAuction = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (!(await canManageProduct(product, req.user.id))) {
            return res.status(403).json({ error: 'You are not allowed to end this auction' });
        }

        const currentTime = new Date();

        if (currentTime >= product.auctionEndTime || product.currentBid >= product.buyNowPrice) { 
            if (product.status === 'Available') {
                if (product.currentBid >= product.buyNowPrice) {
                    const winningBidder = product.activeBidders[product.activeBidders.length - 1];
                    if (winningBidder) {
                        product.finalPrice = product.currentBid;
                        product.boughtBy = winningBidder;
                        product.status = 'Sold';
                    } else {
                        product.status = 'Withdrawn';
                    }
                } else if (product.activeBidders.length > 0) {
                    const winningBidder = product.activeBidders[product.activeBidders.length - 1];
                    product.finalPrice = product.currentBid;
                    product.boughtBy = winningBidder;
                    product.status = 'Sold';
                } else {
                    product.status = 'Withdrawn';
                }
            }

            const io = getIo();
            io.emit('auctionEnded', {
                productId: productId,
                finalPrice: product.finalPrice,
                status: product.status,
                boughtBy: product.boughtBy,
            });

            await product.save();
            return res.status(200).json({ message: 'Auction ended successfully', product });
        } else {
            return res.status(400).json({ error: 'Auction has not ended yet!' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.buyNow = async (req, res) => {
    try {
        const { productId } = req.params;
        const buyerId = req.user.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.status !== 'Available') {
            return res.status(400).json({ error: 'Product is no longer available' });
        }

        if (product.createdBy && product.createdBy.toString() === buyerId.toString()) {
            return res.status(400).json({ error: 'You cannot buy your own auction.' });
        }

        if (product.buyNowPrice > 0) {
            product.finalPrice = product.buyNowPrice;
            product.boughtBy = buyerId;
            product.status = 'Sold';

            const io = getIo();
            io.emit('productSold', {
                productId: productId,
                finalPrice: product.finalPrice,
                buyerId: buyerId,
                status: product.status,
            });

            await product.save();
            return res.status(200).json({ message: 'Product purchased successfully', product });
        } else {
            return res.status(400).json({ error: 'Buy Now option is not available for this product' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
