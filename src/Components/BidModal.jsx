import React, { useState, useEffect } from 'react';

const BidModal = ({ isOpen, onClose, productName, startingPrice, currentBid, bidIncrement,  onBidSubmit }) => {
    // Initialize bidAmount based on currentBid and startingPrice
    const [bidAmount, setBidAmount] = useState(currentBid ? currentBid + bidIncrement : startingPrice);

    // Update bidAmount when currentBid or bidIncrement changes
    useEffect(() => {
        setBidAmount(currentBid ? currentBid + bidIncrement : startingPrice);
    }, [currentBid, startingPrice, bidIncrement]);

    const handleBidChange = (e) => {
        setBidAmount(Number(e.target.value));
    };

    const handleBidSubmit = () => {
        if (bidAmount < startingPrice) {
            alert("Bid amount must be higher than the starting price.");
            return;
        }
        onBidSubmit(bidAmount);
        onClose(); // Close modal after bid submission
    };

    const incrementBid = () => {
        setBidAmount((prevBid) => prevBid + bidIncrement);
    };

    const decrementBid = () => {
        if (bidAmount - bidIncrement >= startingPrice) {
            setBidAmount((prevBid) => prevBid - bidIncrement);
        }
    };

    if (!isOpen) return null; // Don't render the modal if not open

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-[#242628] p-6 rounded-lg w-1/3 text-white">
                <h2 className="text-2xl font-bold mb-4">Place Your Bid on {productName}</h2>
                <div className="mb-4">
                    <label htmlFor="bidAmount" className="block text-lg mb-2">Enter your bid amount:</label>
                    <div className="flex items-center gap-x-2">
                        <button
                            onClick={decrementBid}
                            className="bg-[#AD8B73] text-white py-1 px-4 rounded-md hover:bg-[#6c3c3c]"
                        >
                            -
                        </button>
                        <div className="relative w-full">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black">Rs.</span>
                            <input
                                type="number"
                                id="bidAmount"
                                value={bidAmount}
                                onChange={handleBidChange}
                                className="w-full pl-12 p-2 border border-gray-300 rounded-md text-black text-center"
                                placeholder="Enter bid amount"
                                readOnly
                            />
                        </div>
                        <button
                            onClick={incrementBid}
                            className="bg-[#AD8B73] text-white py-1 px-4 rounded-md hover:bg-[#6c3c3c]"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={handleBidSubmit}
                        className="bg-[#AD8B73] text-white py-2 px-4 rounded-md hover:bg-[#6c3c3c]"
                    >
                        Submit Bid
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BidModal;
