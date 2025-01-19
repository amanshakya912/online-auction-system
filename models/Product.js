const mongoose = require('mongoose')
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
    // productId: {
    //     type: Number,
    //     unique: true
    // },
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
        // required: true,
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
        ref: 'User',
        required: true
    },
    numberOfBids: {
        type: Number,
        default: 0
    },
    activeBidders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // unique: true
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductDetail'
    },
    finalPrice: {
        type: Number,
        default: null // This ensures that it is explicitly empty before the auction ends.
    },    
    boughtBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false
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
productSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('name')) {
        // Generate slug only if the document is new or the name has changed
        let slug = slugify(this.name, { lower: true, strict: true });

        let existingProduct = await mongoose.models.Product.findOne({ slug });
        let counter = 1;

        while (existingProduct && existingProduct._id.toString() !== this._id.toString()) {
            // Ensure the slug is unique among other products
            slug = `${slugify(this.name, { lower: true, strict: true })}-${counter}`;
            counter++;
            existingProduct = await mongoose.models.Product.findOne({ slug });
        }

        this.slug = slug;
    }
    next();
});


module.exports = mongoose.model('Product', productSchema);