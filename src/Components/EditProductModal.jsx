import React, { useState, useEffect } from 'react';
import Api from '../utils/Api';

const EditProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: 1,
        startingPrice: 0,
        buyNowPrice: 0,
        bidIncrement: 0,
        category: '',
        images: [],
        auctionStartTime: '',
        auctionEndTime: '',
    });

    // Initialize form data with product details
    useEffect(() => {
        if (product) {
            const formatDate = (date) => {
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            };
            setFormData({
                name: product.name,
                description: product.description,
                quantity: product.quantity,
                startingPrice: product.startingPrice,
                buyNowPrice: product.buyNowPrice,
                bidIncrement: product.bidIncrement,
                category: product.category,
                images: product.images,
                auctionStartTime: formatDate(product.auctionStartTime),
                auctionEndTime: formatDate(product.auctionEndTime),
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedProduct = await Api.updateProduct(product._id, formData);
            onSave(updatedProduct);
            onClose(); // Close modal after saving
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#242628] p-6 rounded-lg w-full max-w-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Edit Product</h2>
                    <button className="text-black" onClick={onClose}>X</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg text-black"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg text-black"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Starting Price</label>
                            <input
                                type="number"
                                name="startingPrice"
                                value={formData.startingPrice}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg text-black"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium">Buy Now Price</label>
                            <input
                                type="number"
                                name="buyNowPrice"
                                value={formData.buyNowPrice}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Bid Increment</label>
                            <input
                                type="number"
                                name="bidIncrement"
                                value={formData.bidIncrement}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg text-black"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg text-black"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="mobile">Mobile</option>
                            {/* Add more categories as needed */}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Auction Start Time</label>
                        <input
                            type="datetime-local"
                            name="auctionStartTime"
                            value={formData.auctionStartTime}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg text-black"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Auction End Time</label>
                        <input
                            type="datetime-local"
                            name="auctionEndTime"
                            value={formData.auctionEndTime}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg text-black"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border-0 rounded-md bg-gray-500 hover:bg-gray-700 text-white py-2 px-5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-5"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
