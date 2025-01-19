import { Link } from "react-router-dom";

const ActiveBiddersModal = ({ activeBidders, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#242628] w-1/3 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Active Bidders</h2>
                    <button
                        onClick={onClose}
                        className="text-red-500 hover:text-red-700 text-lg"
                    >
                        ✕
                    </button>
                </div>
                {activeBidders.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {activeBidders.map((bidder, index) => (
                            <li
                                key={index}
                                className="py-2 text-white flex justify-between"
                            >
                                <span>Bidder {index + 1}</span>
                                <Link to={`/user/${bidder}`}><span className="cursor-pointer hover:text-amber-900">{bidder}</span></Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-white">No active bidders yet.</p>
                )}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveBiddersModal;
