const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: false
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    quantity: {
        type: Number,
        default: 1
    },
    startingPrice: {
        type: Number,
        required: true
    },
    buyNowPrice: {
        type: Number,
        required: true
    },
    currentBid: {
        type: Number,
        default: 0
    },
    bidIncrement: {
        type: Number,
        default: 1
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        required: true
    },
    numberOfBids: {
        type: Number,
        default: 0
    },
    activeBidders: [{
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        unique: true
    }],
    category: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    auctionStartTime: {
        type: Date,
        default: Date.now
    },
    auctionEndTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Withdrawn'],
        default: 'Available'
    },
    details: {
        type: mongoose.Schema.Types.ObjectId, // Foreign key reference to detailed information
        // ref: 'ProductDetail'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

// Automatically generate and ensure the slug is unique before saving
productSchema.pre('save', async function(next) {
    if (this.name) {
        let slug = slugify(this.name, { lower: true, strict: true });

        const existingProduct = await mongoose.models.Product.findOne({ slug });
        
        let counter = 1;
        while (existingProduct) {
            slug = `${slugify(this.name, { lower: true, strict: true })}-${counter}`;
            counter++;
            existingProduct = await mongoose.models.Product.findOne({ slug });
        }

        this.slug = slug;
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
