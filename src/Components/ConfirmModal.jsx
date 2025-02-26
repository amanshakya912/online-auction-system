import React from 'react';

const ConfirmModal = ({ show, onClose, onConfirm, maxPrice }) => {
    if (!show) return null; // If show is false, return null and don't render the modal

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#242628] p-6 rounded-md md:w-1/3 w-full mx-5 md:mx-0">
                <h3 className="text-xl font-semibold mb-4">Are you sure you want to buy at the maximum price of Rs. {maxPrice}?</h3>
                <div className="flex justify-between">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
