const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    const { name, description, quantity, startingPrice, buyNowPrice, bidIncrement, auctionStartTime, auctionEndTime, category } = req.body
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
    console.log('req',req.body)
    // const userId = req.user._id;

    try {   
        // Fetch product details
        const product = await Product.findById(productId);

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
        if (!product.activeBidders.includes(userId)) {
            product.activeBidders.push(userId);
        }

        // Save the product with updated bid details
        const updatedProduct = await product.save();

        // Respond with the updated product details
        res.status(200).json({
            message: 'Bid placed successfully!',
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error placing the bid. Please try again later.' });
    }
};
