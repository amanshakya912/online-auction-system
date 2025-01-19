const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const { sendEmail }  = require('../mail/sendEmail'); // Import the sendEmail function
const { getIo } = require('../socket');

exports.addProduct = async (req, res) => {
    const { name, description, quantity, startingPrice, buyNowPrice, bidIncrement, auctionStartTime, auctionEndTime, category, productDetailId } = req.body
    // console.log('req', req.body, req.files)
    
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

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
        // { name: 'images', value: images }
    ];

    const missingFields = requiredFields
        .filter(field => !field.value)
        .map(field => field.name);

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'At least one image is required' });
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Assuming the token is passed in the Authorization header as "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

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
            createdBy: decoded.id,
            details: productDetailId
        })

        const savedProduct = await newProduct.save();
        res.status(201).json(
            {message: 'Your auction has been listed successfully!',
             data:savedProduct
            });
    } catch (error) {
        res.status(500).json({ error: 'Error adding product', message: error.message });
    }
}


// Edit product controller
exports.editProduct = async (req, res) => {
  const { id } = req.params;  // Get product ID from URL parameters
  const { name, description, quantity, startingPrice, buyNowPrice, bidIncrement, category, images, auctionStartTime, auctionEndTime } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        quantity,
        startingPrice,
        buyNowPrice,
        bidIncrement,
        category,
        images,
        auctionStartTime,
        auctionEndTime,
      },
      { new: true }  // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;  // Get product ID from URL parameters
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Server error' });
    }
};

exports.getProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products', message: error.message });
    }
};

exports.getProductBySlug = async (req, res) => {
    const { slug } = req.params;  // Get the slug from the request parameters

    try {
        // Find the product by slug
        const product = await Product.findOne({ slug });

        // If product not found
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Return the product data
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};



// Handle the bid submission

exports.placeBid = async (req, res) => {
    const { productId, bidAmount, userId } = req.body;
    console.log('uid',userId)
    try {
        // Fetch product details and active bidders' information
        const product = await Product.findById(productId).populate('activeBidders', 'email'); // Populate to get bidder's emails

        // Check if the auction is still active
        const currentTime = Date.now();
        if (product.auctionEndTime < currentTime) {
            return res.status(400).json({ error: 'Auction has ended.' });
        }

        // Check if the bid is valid
        const validBidAmount = product.currentBid + product.bidIncrement;
        if (bidAmount < validBidAmount) {
            return res.status(400).json({ error: `Bid must be at least Rs. ${validBidAmount}` });
        }

        // Update product's current bid, number of bids, and active bidders
        product.currentBid = bidAmount;
        product.numberOfBids += 1;

        // Add the user to active bidders if not already present
        if (!userId) {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        }
        if (!userId) {
            throw new Error("Invalid user ID");
        }
        if (!Array.isArray(product.activeBidders)) {
            product.activeBidders = [];
        }
        
        // Filter out null/undefined values from activeBidders
        product.activeBidders = product.activeBidders.filter(bidder => bidder);
        
        // Check if the user is already in activeBidders
        product.activeBidders = product.activeBidders.filter(Boolean); // Remove null/undefined
        if (!product.activeBidders.some(bidder => bidder.toString() === userId.toString())) {
            product.activeBidders.push(userId);
        }
        console.log('bidder', product.activeBidders)

        // Save the product with updated bid details
        const updatedProduct = await product.save();
        const io = getIo();
        io.emit('bidUpdated', {
            productId,
            currentBid: product.currentBid,
            activeBidders: product.activeBidders, // Include updated activeBidders array
            bidderId: userId,
            numberOfBids: product.numberOfBids
        });

        res.status(200).json({
            message: 'Bid placed successfully!',
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error placing the bid. Please try again later.' });
    }
};


exports.getProductsByUser = async (req, res) => {
  try {
    // Extract userId from request parameters or query
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const products = await Product.find({ createdBy: userId }).populate('createdBy', 'username email'); // Populate username and email from the User model

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this user.' });
    }

    res.status(200).json({
      message: 'Products fetched successfully.',
      products,
    });
  } catch (error) {
    console.error('Error fetching products by user:', error);
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

        const currentTime = new Date();
        console.log('pro',product)
        console.log('ct', currentTime, 'at', product.auctionEndTime)
        // Case 1: Auction time has ended
        if (currentTime >= product.auctionEndTime || product.currentBid >= product.buyNowPrice) { 
            // If Buy Now Price is met, auction ends early

            if (product.status === 'Available') { // Only process if auction is still 'Available'

                // Case 2: Buy Now price reached or exceeded
                if (product.currentBid >= product.buyNowPrice) {
                    const winningBidder = product.activeBidders[product.activeBidders.length - 1]; // Assuming last bidder wins
                    product.finalPrice = product.currentBid;
                    product.boughtBy = winningBidder;
                    product.status = 'Sold';
                } 
                // Case 3: No bids placed, or Buy Now not met
                else if (product.activeBidders.length > 0) {
                    const winningBidder = product.activeBidders[product.activeBidders.length - 1]; // Last bidder wins
                    product.finalPrice = product.currentBid;
                    product.boughtBy = winningBidder;
                    product.status = 'Sold';
                }
                // Case 4: No bids at all, mark as Withdrawn
                else {
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
        res.status(500).json({ error: error.message });
    }
};



exports.buyNow = async (req, res) => {
    try {
        const { productId } = req.params;
        console.log('header',req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const buyerId = decoded.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.status !== 'Available') {
            return res.status(400).json({ error: 'Product is no longer available' });
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
        res.status(500).json({ error: error.message });
    }
};

