const mongoose = require('mongoose');

const ProductDetailSchema = new mongoose.Schema({
    battery_power: { type: Number, required: true }, // Battery capacity in mAh
    blue: { type: Number, required: true }, // Bluetooth availability (true/false)
    clock_speed: { type: Number, required: true }, // Clock speed in GHz
    dual_sim: { type: Number, required: true }, // Dual SIM support (true/false)
    fc: { type: Number, required: true }, // Front camera megapixels
    four_g: { type: Number, required: true }, // 4G support (true/false)
    int_memory: { type: Number, required: true }, // Internal memory in GB
    m_dep: { type: Number, required: true }, // Mobile depth in cm
    mobile_wt: { type: Number, required: true }, // Mobile weight in grams
    n_cores: { type: Number, required: true }, // Number of CPU cores
    pc: { type: Number, required: true }, // Primary camera megapixels
    px_height: { type: Number, required: true }, // Screen resolution height in pixels
    px_width: { type: Number, required: true }, // Screen resolution width in pixels
    ram: { type: Number, required: true }, // RAM in MB
    sc_h: { type: Number, required: true }, // Screen height in cm
    sc_w: { type: Number, required: true }, // Screen width in cm
    talk_time: { type: Number, required: true }, // Talk time in hours
    three_g: { type: Number, required: true }, // 3G support (true/false)
    touch_screen: { type: Number, required: true }, // Touchscreen availability (true/false)
    wifi: { type: Number, required: true }, // Wi-Fi support (true/false)
    price_range: { type: Number, required: true },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const ProductDetail = mongoose.model('ProductDetail', ProductDetailSchema);

module.exports = ProductDetail;
