import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Api from "../utils/Api";
import Helper from "../utils/Helper";
import Countdown from 'react-countdown';

const BrowseAuction = () => {
    const { slug } = useParams(); // Get the slug from the URL
    const [auctions, setAuctions] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const res = await Api.getProducts(); // Fetch all auctions from API
                const currentTime = new Date();
                let filteredAuctions = [];

                switch (slug) {
                    case "live":
                        setTitle("Live Auctions");
                        filteredAuctions = res.filter(
                            (product) =>
                                new Date(product.auctionStartTime) <= currentTime && // Auction has started
                                new Date(product.auctionEndTime) > currentTime && // Auction has not ended
                                product.status === 'Available' // Only include available auctions
                        );
                        break;

                    case "upcoming":
                        setTitle("Upcoming Auctions");
                        filteredAuctions = res.filter(
                            (product) => new Date(product.auctionStartTime) > currentTime
                        );
                        break;
                    case "recent":
                        setTitle("Recent Auctions");
                        filteredAuctions = res.filter(
                            (product) =>
                                new Date(product.auctionEndTime) <= currentTime || // Auction has ended
                                (product.status === 'Sold' || product.status === 'Withdrawn') // Include Sold or Withdrawn auctions
                        );
                        console.log('rec',filteredAuctions)
                    break;
                    default:
                        setTitle("Auctions");
                        break;
                }

                setAuctions(filteredAuctions); // Limit to 10 items
            } catch (e) {
                console.error("Error fetching auctions:", e);
            }
        };

        fetchAuctions();
    }, [slug]); // Refetch auctions whenever slug changes
    const renderer = ({ days, hours, minutes, seconds }) => {
        return (
            <div className="grid grid-cols-4 bg-[#212121] text-white p-2 text-center">
                <div className="col-span-1 border-0 border-r">
                    {days}D
                </div>
                <div className="col-span-1 border-0 border-r">
                    {hours}H
                </div>
                <div className="col-span-1 border-0 border-r">
                    {minutes}M
                </div>
                <div className="col-span-1">
                    {seconds}S
                </div>
            </div>
        );
    };
    return (
        <>
            <Header />
            <div className="bg-black">
                <div className="w-full container mx-auto relative">
                    <div className="text-center font-lora text-3xl text-white py-10">
                        {title}
                    </div>
                    {auctions.length > 0 ? (
                        <>
                            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pb-10">
                                {auctions.map((product) => (
                                    <div key={product._id}>
                                        <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                            <img src={Helper.BASE_URL + product.images[0]} alt={product.name} />
                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                                <Link to={`/${product.slug}`}>
                                                    <div className="cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5">
                                                        View Details
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="mb-4 px-5 lg:w-2/3 w-full">
                                                {title != 'Recent Auctions' ? <>
                                                    <Countdown date={title == 'Live Auctions' ? new Date(product.auctionEndTime) : new Date(product.auctionStartTime)} renderer={renderer} />
                                                </> : <>
                                                </>
                                                }
                                            </div>
                                            <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                                <div className="flex flex-col">
                                                    <div className="text-base">{product.name}</div>
                                                    <div className="text-sm">Current Bid: Rs. {product.currentBid == 0 ? product.startingPrice : product.currentBid}</div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="text-base">
                                                        No. of Bids: {product.numberOfBids || 0}
                                                    </div>
                                                    <div className="text-base">Active Bidders: {product.activeBidders.length}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-white py-10">No auctions found</div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BrowseAuction;
