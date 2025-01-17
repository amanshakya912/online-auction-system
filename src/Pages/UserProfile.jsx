import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useParams } from 'react-router-dom';
import Api from '../utils/Api';

const UserProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await Api.getUser(username);
                console.log(response)
                setUser(response);
            } catch (err) {
                console.log(err)
                setUser(null)
            }
        };
        if(username){
        fetchUser();
        }
    }, []);
    return (
        <>
            <Header/>
                <div className="bg-black min-h-screen">
                    <div className="container mx-auto py-10 px-5">
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
                                <button className="bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md">
                                    Contact
                                </button>
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
                                        <span className="text-gray-400">Joined On:</span> {user.createdAt}
                                    </div>
                                </div>
                                {/* Actions */}
                                <div>
                                    <h3 className="text-xl font-semibold border-b border-[#AD8B73] pb-2 mb-4">Actions</h3>
                                    <div className="flex flex-col gap-y-4">
                                        <button className="bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md">
                                            Edit Profile
                                        </button>
                                        <button className="bg-[#AD8B73] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md">
                                            View Bidding History
                                        </button>
                                        <button className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-md">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#242628] p-8 rounded-2xl text-white mt-10">
                            <h3 className="text-xl font-semibold border-b border-[#AD8B73] pb-2 mb-4">Recent Bids</h3>
                            {/* {user.bids.length > 0 ? (
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
                            )} */}
                        </div>
                    </div>
                </div>
            <Footer/>
        </>
    );
};

export default UserProfile;
