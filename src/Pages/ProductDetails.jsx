import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../Components/Footer"
import Header from "../Components/Header"
import img1 from "../images/mobile1.png"
import { useEffect, useState } from "react"
import Countdown from 'react-countdown';
import { faCartShopping, faGavel, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component";
import RecentAuction from "../Components/RecentAuction";
import { useParams } from "react-router-dom";
import Api from "../utils/Api";
import Helper from "../utils/Helper";
import BidModal from "../Components/BidModal";

const ProductDetails = () => {
    let countdownDate
    const { slug } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleBidNowClick = () => {
        setIsModalOpen(true); // Open the modal when "Bid Now" is clicked
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };
    const [show,setShow] = useState(false)
    const [quantity, setQuantity] = useState(1);
    const [details, setDetails] = useState()
    const [auctionEnd, setAuctionEnd] = useState(false)
    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    // Function to handle decrement
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };
    const ratingChanged = (newRating) => {
        console.log(newRating);
      };
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


    useEffect(()=>{
        const productDetails = async () => {
            try {
                const res = await Api.getProductBySlug(slug)
                console.log('res',res)
                setDetails(res)
                auctionCountdown(res.auctionStartTime,res.auctionEndTime)
            } catch(e) {
                console.log('err',e)
            }
        }
        productDetails()
    },[])
    const auctionCountdown = (auctionStartTime, auctionEndTime) => {
        const currentTime = Date.now(); // Get current time in milliseconds

        // Determine which date to countdown to
    
        if (currentTime < new Date(auctionStartTime).getTime()) {
        // Auction hasn't started yet
        countdownDate = new Date(auctionStartTime).getTime();
        } else if (currentTime >= new Date(auctionStartTime).getTime() && currentTime < new Date(auctionEndTime).getTime()) {
        // Auction is live
        countdownDate = new Date(auctionEndTime).getTime();
        } else {
            setAuctionEnd(true)
        }
    }
    const handleBidSubmit = async (bidAmount) => {
        // Handle the bid submission logic here
        console.log('Bid Amount:', bidAmount);
        const productId = details?._id
        try {
            const res = await Api.placeBid(productId, bidAmount);
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    };
    return (
        <>
        <Header />
        <div className="bg-black">
            <div className="w-full container mx-auto relative">
                <div className="text-center font-lora text-3xl text-white py-10">
                    Product Detail
                </div>
                <div className="grid grid-cols-2 text-white gap-10">
                    <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer">
                        <img src={`${Helper.BASE_URL}${details?.images}`} alt={`${details?.name}`}/>
                        <div className="absolute bottom-0 w-full">
                            <div className="mb-4 px-5 w-1/2">
                            {auctionEnd ? <div className="bg-[#212121] text-white p-2 text-center"> Auction Time Has Ended </div> :
                            <>
                            <Countdown date={countdownDate} renderer={renderer} />
                            </>}
                            </div>
                        </div>
                        {/* <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                            <div className="flex flex-col">
                                <div className="text-xl">Samsung Galaxy</div>
                                <div className="text-lg">Current Bid: Rs. 30,000</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-xl">No. of Bids: 10</div>
                                <div className="text-lg">Active Bidders: 3</div>
                            </div>
                        </div> */}
                    </div>
                    <div className=" flex flex-col bg-[#242628] border-0 rounded-2xl relative overflow-hidden group  p-5 gap-y-5">
                        <div className="text-3xl text-white">
                            {details?.name}
                        </div>
                        <div className="flex justify-between items-center border border-y-2 border-black border-x-0 py-2">
                            <div className="flex items-center gap-x-2">
                                <div className="bg-black px-3 py-2 rounded-full">
                                    <FontAwesomeIcon className="text-base" icon={faUser}/>
                                </div>
                                <div>
                                    <div className="text-base hover:text-[#AD8B73]">
                                        Aman Shakya
                                    </div>
                                    <div className="text-sm hover:text-[#AD8B73]">
                                        Contact Seller
                                    </div>
                                </div>
                            </div>
                            <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={24}
                                activeColor="#fff"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-y-3">
                            <div>Current Bid</div>
                            <div className="text-end">Rs. {details?.startingPrice}</div>
                            <div>No. of Bids</div>
                            <div className="text-end">{details?.numberOfBids}</div>
                            <div>Active Bidders</div>
                            <div className="text-end">{details?.activeBidders}</div>
                            <div>Max Price</div>
                            <div className="text-end">Rs. {details?.buyNowPrice}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 items-center">
                            <div>Quantity ({details?.quantity} Available)</div>
                            <div className="grid grid-cols-3 bg-black text-center py-2 items-center">
                                <button 
                                    onClick={decrementQuantity} 
                                    className="text-base hover:text-[#AD8B73]"
                                >
                                    -
                                </button>
                                <div className="text-base border-0 border-x">{quantity}</div>
                                <button 
                                    disabled={(quantity >= details?.quantity) ? true : false}
                                    onClick={incrementQuantity} 
                                    className="text-base hover:text-[#AD8B73]"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-x-5">
                            <div 
                            onClick={handleBidNowClick}
                            className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-1/2'>
                                Bid Now <FontAwesomeIcon icon={faGavel}/>
                            </div>
                            <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-1/2'>
                                Buy Now <FontAwesomeIcon icon={faCartShopping}/>
                            </div>
                        </div>
                        <div className="flex gap-x-5">
                            <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-1/2'>
                                Add to Cart <FontAwesomeIcon icon={faCartShopping}/>
                            </div>
                            <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-1/2'>
                                Add to Wishlist <FontAwesomeIcon icon={faHeart}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-10">
                    <div className="flex flex-col bg-[#242628] border-0 rounded-2xl p-5">
                        <div className="text-2xl font-lora text-white">
                            About the Product
                        </div>         
                        <div className="text-white my-2">
                            {details?.description}
                        </div>
                    </div>
                </div>
                <RecentAuction />
            </div>
            <BidModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                productName={details?.name}
                startingPrice={details?.startingPrice}
                currentBid={details?.currentBid}
                bidIncrement={details?.bidIncrement}
                onBidSubmit={handleBidSubmit}
            />       
        </div>
        <Footer/>
        </>
    )
}
export default ProductDetails