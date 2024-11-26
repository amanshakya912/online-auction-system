const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    const { name, description, quantity, startingPrice, buyNowPrice, bidIncrement, auctionStartTime, auctionEndTime, category, images } = req.body
    
    const requiredFields = [
        { name: 'name', value: name },
        { name: 'quantity', value: quantity},
        { name: 'startingPrice', value: startingPrice },
        { name: 'buyNowPrice', value: buyNowPrice },
        { name: 'bidIncrement', value: bidIncrement },
        { name: 'auctionStartTime', value: auctionStartTime },
        { name: 'auctionEndTime', value: auctionEndTime },
        { name: 'category', value: category },
        { name: 'images', value: images }
    ];

    const missingFields = requiredFields
        .filter(field => !field.value)
        .map(field => field.name);

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
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
            images,
            status: 'Available',
        })

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct); // Return the saved product
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