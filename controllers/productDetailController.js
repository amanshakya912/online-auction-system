const ProductDetail = require('../models/ProductDetail');
const Product = require('../models/Product');
const predictPrice = require('../ai/pricePredict');

exports.addProductDetail = async (req, res) => {
    try {
        const features = req.body; // Expecting an array of features

        // Validate that the features array contains exactly 20 elements
        if (!Array.isArray(features) || features.length !== 20) {
            return res.status(400).json({ error: 'Invalid data format. Expected an array with 20 elements.' });
        }

        // Predict price range using Python script
        const predictedPrice = await predictPrice(features);

        // Map the features to the schema fields
        const [battery_power, blue, clock_speed, dual_sim, fc, four_g, int_memory, m_dep, mobile_wt, n_cores,
            pc, px_height, px_width, ram, sc_h, sc_w, talk_time, three_g, touch_screen, wifi] = features;

        // Create a ProductDetail object
        const productDetailData = {
            battery_power,
            blue,
            clock_speed,
            dual_sim,
            fc,
            four_g,
            int_memory,
            m_dep,
            mobile_wt,
            n_cores,
            pc,
            px_height,
            px_width,
            ram,
            sc_h,
            sc_w,
            talk_time,
            three_g,
            touch_screen,
            wifi,
            price_range: predictedPrice,
        };

        const productDetail = new ProductDetail(productDetailData);
        const savedProductDetail = await productDetail.save();

        // const { productId } = req.query; // Accept productId as a query parameter
        // if (productId) {
        //     const product = await Product.findById(productId);
        //     if (!product) {
        //         return res.status(404).json({ error: 'Product not found.' });
        //     }

        //     product.details = savedProductDetail._id;
        //     await product.save();
        // }

        res.status(201).json({
            message: 'Product details created successfully.',
            productDetail: savedProductDetail,
            productDetailId: savedProductDetail._id
        });
    } catch (error) {
        console.error('Error creating product details:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

exports.getProductDetailById = async (req, res) => {
    try {
        const { id } = req.params; 
        const product = await Product.findById(id).populate('details');

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        if (!product.details) {
            return res.status(404).json({ error: 'Product details not found.' });
        }

        // Return the product along with its details
        res.status(200).json({
            message: 'Product details fetched successfully.',
            productDetails: product.details, 
        });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

