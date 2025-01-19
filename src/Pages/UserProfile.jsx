import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Api from '../utils/Api';
import 'swiper/css';
import Helper from '../utils/Helper';
import EditProfileModal from '../Components/EditProfileModal';
import ConfirmationModal from '../Components/ConfirmationModal';
const UserProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [auctions, setAuctions] = useState([]);
    const [pastAuctions, setPastAuctions] = useState([]);
    const [currentAuctions, setCurrentAuctions] = useState([]);
    const [upcomingAuctions, setUpcomingAuctions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [same, setSame] = useState(false)
    const id = localStorage.getItem('id');
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const navigate = useNavigate()
    const handleDeleteAccount = async () => {
        try {
            const response = await Api.deleteUser(); // Call your delete API endpoint
            console.log('Account deleted:', response.data);
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('id');
            // Redirect to the login page or home page
            navigate('/sign-up')
        } catch (error) {
            console.error('Error deleting account:', error);
        }
        setIsModalOpen2(false);
    };
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await Api.getUser(username);
                console.log(response)
                setUserId(response._id)
                setUser(response);
            } catch (err) {
                console.log('err', err)
                setUser(null)
            }
        };
        if (username) {
            fetchUser();
        }
    }, [refreshKey]);
    useEffect(() => {
        const fetchProductsByUser = async () => {
            try {
                const res = await Api.getProductByUser(userId);
                const allAuctions = res.products;

                // Filter auctions based on date
                const now = new Date();
                const past = allAuctions.filter(
                    (auction) => new Date(auction.auctionEndTime) < now
                );
                const current = allAuctions.filter(
                    (auction) =>
                        new Date(auction.auctionStartTime) <= now &&
                        new Date(auction.auctionEndTime) >= now
                );
                const upcoming = allAuctions.filter(
                    (auction) => new Date(auction.auctionStartTime) > now
                );

                // Update state
                setAuctions(allAuctions);
                setPastAuctions(past);
                setCurrentAuctions(current);
                setUpcomingAuctions(upcoming);
            } catch (err) {
                console.log("Error fetching products:", err);
                setAuctions(null);
            }
        };
        if (userId) {
            fetchProductsByUser();
            if (userId == id) {
                console.log('same', userId, id)
                setSame(true)
            }
        }
    }, [userId]);
    const handleRefreshData = (key) => {
        setRefreshKey(key)
    }
    return (
        <>
            <Header />
            <div className="bg-black min-h-screen">
                <div className="container mx-auto py-10 px-5">
                    {user ?
                        <>
                            <div className="text-center font-lora text-3xl text-white py-10">
                                User Profile
                            </div>
                            <div className="bg-[#242628] p-8 rounded-2xl text-white shadow-md">
                                <div className="flex items-center mb-8 justify-between">
                                    <div className='flex items-center gap-x-5'>
                                        <div className="bg-[#AD8B73] w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold">
                                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                        </div>
                                        <div className=''>
                                            <div className="text-2xl font-bold">{user.firstName} {user.lastName}</div>
                                            <div className="text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                    {/* {!same && (
                                        <button className="bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md">
                                            Contact
                                        </button>
                                    )} */}
                                </div>
                                <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-xl font-semibold border-b border-[#AD8B73] pb-2 mb-4">Personal Information</h3>
                                        <div className="mb-3">
                                            <span className="text-gray-400">Username:</span> {user.userName}
                                        </div>
                                        <div className="mb-3">
                                            <span className="text-gray-400">Email:</span> {user.email}
                                        </div>
                                        <div className="mb-3">
                                            <span className="text-gray-400">Joined On:</span> {new Date(user.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    {same && (
                                        <>
                                            <div>
                                                <h3 className="text-xl font-semibold border-b border-[#AD8B73] pb-2 mb-4">Actions</h3>
                                                <div className="flex flex-col gap-y-4">
                                                    <button onClick={handleOpenModal} className="bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md">
                                                        Edit Profile
                                                    </button>
                                                    {/* <button className="bg-[#AD8B73] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md">
                                            View Bidding History
                                        </button> */}
                                                    <button onClick={() => setIsModalOpen2(true)} className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-md">
                                                        Delete Account
                                                    </button>
                                                </div>
                                            </div>
                                            {isModalOpen && (
                                                <EditProfileModal
                                                    onClose={handleCloseModal}
                                                    initialData={user}
                                                    refreshKey={handleRefreshData}
                                                />
                                            )}
                                            <ConfirmationModal
                                                isOpen={isModalOpen2}
                                                onClose={() => setIsModalOpen2(false)}
                                                onConfirm={handleDeleteAccount}
                                            />
                                        </>
                                    )}

                                </div>
                            </div>
                            {/* <div className="bg-[#242628] p-8 rounded-2xl text-white mt-10">
                            <h3 className="text-xl font-semibold border-b border-[#AD8B73] pb-2 mb-4">Recent Bids</h3>
                            {user.bids.length > 0 ? (
                                <div className="space-y-4">
                                    {user.bids.map((bid, index) => (
                                        <div key={index} className="flex justify-between bg-[#212121] p-4 rounded-md">
                                            <div>
                                                <div className="font-semibold">{bid.productName}</div>
                                                <div className="text-sm text-gray-400">Bid Amount: Rs. {bid.amount}</div>
                                            </div>
                                            <div className="text-sm text-gray-400">{new Date(bid.date).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-400">No recent bids found.</div>
                            )}
                        </div> */}
                            <div className="bg-[#242628] p-8 rounded-2xl text-white mt-10">
                                <h3 className="text-xl font-semibold border-b border-[#AD8B73] pb-2 mb-4">Auction Listings</h3>
                                {auctions
                                    ?
                                    <>
                                        {currentAuctions && (
                                            <>
                                                <div className='text-white py-4 font-medium'>Current Auctions</div>
                                                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                                                    {currentAuctions.map((auction) => (
                                                        <div key={auction._id}>
                                                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                                                {/* Auction Image */}
                                                                <img
                                                                    src={`${Helper.BASE_URL}${auction.images[0]}`}
                                                                    alt={auction.name}
                                                                    className="w-full h-[200px] object-cover rounded-t-2xl"
                                                                />
                                                                {/* Overlay */}
                                                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                                                    <Link to={`/${auction.slug}`}>
                                                                        <div className="cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5">
                                                                            View Details
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                                {/* Auction Details */}
                                                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                                                    <div className="flex flex-col">
                                                                        <div className="text-base">{auction.name}</div>
                                                                        <div className="text-sm">Starting Price: Rs. {auction.startingPrice.toLocaleString()}</div>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <div className="text-base">No. of Bids: {auction.numberOfBids}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {upcomingAuctions && (
                                            <>
                                                <div className='text-white py-4 font-medium'>Upcoming Auctions</div>
                                                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                                                    {upcomingAuctions.map((auction) => (
                                                        <div key={auction._id}>
                                                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                                                {/* Auction Image */}
                                                                <img
                                                                    src={`${Helper.BASE_URL}${auction.images[0]}`}
                                                                    alt={auction.name}
                                                                    className="w-full h-[200px] object-cover rounded-t-2xl"
                                                                />
                                                                {/* Overlay */}
                                                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                                                    <Link to={`/${auction.slug}`}>
                                                                        <div className="cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5">
                                                                            View Details
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                                {/* Auction Details */}
                                                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                                                    <div className="flex flex-col">
                                                                        <div className="text-base">{auction.name}</div>
                                                                        <div className="text-sm">Starting Price: Rs. {auction.startingPrice.toLocaleString()}</div>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <div className="text-base">No. of Bids: {auction.numberOfBids}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {pastAuctions && (
                                            <>
                                                <div className='text-white py-4 font-medium'>Past Auctions</div>
                                                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                                                    {pastAuctions.map((auction) => (
                                                        <div key={auction._id}>
                                                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                                                {/* Auction Image */}
                                                                <img
                                                                    src={`${Helper.BASE_URL}${auction.images[0]}`}
                                                                    alt={auction.name}
                                                                    className="w-full h-[200px] object-cover rounded-t-2xl"
                                                                />
                                                                {/* Overlay */}
                                                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                                                    <Link to={`/${auction.slug}`}>
                                                                        <div className="cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5">
                                                                            View Details
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                                {/* Auction Details */}
                                                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                                                    <div className="flex flex-col">
                                                                        <div className="text-base">{auction.name}</div>
                                                                        <div className="text-sm">Starting Price: Rs. {auction.startingPrice.toLocaleString()}</div>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <div className="text-base">No. of Bids: {auction.numberOfBids}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                    :
                                    <> No Auctions Available </>}
                            </div>
                        </> :
                        <>
                            <div className='mt-20'>
                                <div className="bg-[#242628] p-8 rounded-2xl text-white shadow-md text-3xl text-center font-lora">
                                    User Not Found!
                                </div>
                            </div>
                        </>}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserProfile;
