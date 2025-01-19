import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../Components/Footer"
import Header from "../Components/Header"
import img1 from "../images/mobile1.png"
import { useEffect, useState } from "react"
import Countdown from 'react-countdown';
import { faCartShopping, faGavel, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component";
import RecentAuction from "../Components/RecentAuction";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../utils/Api";
import Helper from "../utils/Helper";
import BidModal from "../Components/BidModal";
import EditProductModal from "../Components/EditProductModal";
import ConfirmationModal from "../Components/ConfirmationModal";
import { ToastContainer, toast } from 'react-toastify';
import ActiveBiddersModal from "../Components/ActiveBiddersModal";
import axios from "axios";
import io from 'socket.io-client';
import ConfirmModal from "../Components/ConfirmModal";

const socket = io(Helper.BASE_URL);

const ProductDetails = () => {
    const userid = localStorage.getItem('id');
    const un = localStorage.getItem('username');
    console.log('Uid',userid, un)
    const token = localStorage.getItem('token')
    const { slug } = useParams()
    const [liveBid, setLiveBid] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [show, setShow] = useState(false)
    const [quantity, setQuantity] = useState(1);
    const [details, setDetails] = useState()
    const [auctionEnd, setAuctionEnd] = useState(false)
    const [countdownDate, setCountdownDate] = useState()
    const [creatorId, setCreatorId] = useState(null)
    const [creator, setCreator] = useState(null)
    const [same, setSame] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [prodDetailsId, setProdDetailsId] = useState(null)
    const [prodDetails, setProdDetails] = useState(null)
    const [openDModal, setOpenDModal] = useState(false)
    const [prodNotFound, setProdNotFound] = useState(false)
    const [activeBidders, setActiveBidders] = useState([])
    const [usernames, setUsernames] = useState([]);
    const [live, setLive] = useState(false)
    const [isBidderModal, setIsBidderModal] = useState(false);
    const [currentBid, setCurrentBid] = useState()
    const [maxPrice, setMaxPrice] = useState()
    const [buyerId, setBuyerId] = useState()
    const [finalPrice, setFinalPrice] = useState()
    const [sold, setSold] = useState(false)
    const [withdrawn, setWithdrawn] = useState(false)
    const [winnerUserName, setWinnerUserName] = useState()
    const [latestBidder, setLatestBidder] = useState()
    const [latestBidderUsername, setLatestBidderUsername] = useState()
    const [buyNowModal, setBuyNowModal] = useState(false)
    const openBidderModal = () => setIsBidderModal(true);
    const closeBidderModal = () => setIsBidderModal(false);
    const navigate = useNavigate();
    const handleBidNowClick = () => {
        if (token) {
            if (live) {
                setIsModalOpen(true);
            } else {
                toast.info('Auction is not live yet!')
            }
        } else {
            toast.info('You need to be signed in to place a bid!')
        }
    };
    const handleBuyNowClick = () => {
        if (token) {
            if (live) {
                setBuyNowModal(true)
            } else {
                toast.info('Auction is not live yet!')
            }
        } else {
            toast.info('You need to be signed in to buy the product!')
        }
    }
    const handleConfirm = async () => {
        try {
            const res = await Api.handleBuyNow(prodDetailsId)
            console.log(res)
            toast.success('You have bought the product!!')
            setRefreshKey((prevKey) => prevKey + 1);
        } catch(e) {
            console.log(e)
        }
        setBuyNowModal(false);
    };

    const handleClose = () => {
        setBuyNowModal(false); // Close the modal if the user cancels
    };
    const handleAddToCartClick = () => {
        if (token) {
            if (live) {
                setIsModalOpen(true);
            } else {
                toast.info('Auction is not live yet!')
            }
        } else {
            toast.info('You need to be signed in to add product to the cart!')
        }
    }
    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const openDeleteModal = () => setOpenDModal(true);
    const closeDeleteModal = () => setOpenDModal(false);
    const handleDeleteProduct = async () => {
        try {
            await Api.deleteProduct(prodDetailsId);
            navigate('/');
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleSave = () => {
        // onSave(updatedProduct);
        toast.success('Product has been updated successfully!')
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    // Function to handle decrement
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
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


    useEffect(() => {
        const productDetails = async () => {
            try {
                const res = await Api.getProductBySlug(slug)
                console.log('res', res)
                setDetails(res)
                auctionCountdown(res.auctionStartTime, res.auctionEndTime)
                setCreatorId(res.createdBy)
                setProdDetailsId(res._id)
                setActiveBidders(res.activeBidders)
                setCurrentBid(res.currentBid)
                setMaxPrice(res.buyNowPrice)
                if (res.finalPrice) {
                    setFinalPrice(res.finalPrice)
                }
                if (res.boughtBy) {
                    setBuyerId(res.boughtBy)
                }
                if (res.status == 'Sold') {
                    setSold(true)
                } else if (res.status == 'Withdrawn') {
                    setWithdrawn(true)
                }
            } catch (e) {
                console.log('err', e)
                setProdNotFound(true)
            }
        }
        productDetails()
    }, [refreshKey])

    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const fetchedUsernames = await Promise.all(
                    activeBidders.map(async (bidderId) => {
                        try {
                            const res = await Api.getUserById(bidderId);
                            // console.log('API Response for bidderId', bidderId, ':', res);
                            return res.userName;  // Adjust this based on actual response structure
                        } catch (error) {
                            // console.error(`Error fetching username for bidder ${bidderId}:`, error);
                            return null;  // Return null or a default value in case of error
                        }
                    })
                );
                console.log('Fetched Usernames:', fetchedUsernames);
                setUsernames(fetchedUsernames.filter(username => username !== null));  // Filter out nulls if any
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        };

        fetchUsernames();
    }, [activeBidders]);

    useEffect(() => {
        const getProductCreator = async () => {
            try {
                const res = await Api.getUserById(creatorId)
                console.log('creator', res);
                setCreator(res)
            } catch (e) {
                console.log('err', e)
            }
        }
        if (creatorId) {
            getProductCreator()
            if (creatorId == userid) {
                console.log('hey', creatorId, userid)
                setSame(true)
            }
        }
    }, [creatorId])
    useEffect(() => {
        const getProductDetails = async () => {
            try {
                const res = await Api.getProductDetailsById(prodDetailsId)
                console.log('prod details', res)
                setProdDetails(res.productDetails)
            } catch (e) {
                console.log('err', e)
            }
        }
        if (prodDetailsId) {
            getProductDetails()
        }
    }, [prodDetailsId])
    const auctionCountdown = (auctionStartTime, auctionEndTime) => {
        const currentTime = Date.now(); // Get current time in milliseconds
        // Determine which date to countdown to
        if (currentTime < new Date(auctionStartTime).getTime()) {
            // Auction hasn't started yet
            console.log('st', auctionStartTime)
            setCountdownDate(new Date(auctionStartTime).getTime());
            console.log('ct', countdownDate)
        } else if (currentTime >= new Date(auctionStartTime).getTime() && currentTime < new Date(auctionEndTime).getTime()) {
            // Auction is live
            setLive(true)
            setCountdownDate(new Date(auctionEndTime).getTime());
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
            toast.success('Your Bid Has been registered successfully!!')
            setRefreshKey((prevKey) => prevKey + 1);
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(()=>{
        const getWinnerUserName = async () => {
            try {
                const res = await Api.getUserById(buyerId)
                setWinnerUserName(res.userName)
            } catch (e) {
                console.log(e)
            }
        }
        if(buyerId) {
            getWinnerUserName()
        }
    }, [buyerId])
    useEffect(() => {
        const handleAuctionEnd = async () => {
            try {
                const res = await Api.handleAuctionEnd(prodDetailsId)
                console.log('res', res)
                // toast.success('You have succesfully won the auction!')
            } catch (error) {
                console.log('err', error)
                if (axios.isAxiosError(error)) {
                    if (error.response && error.response.data && error.response.data.error) {
                        toast.error(error.response.data.error);
                    } else if (error.response) {
                        toast.error(`Error ${error.response.status}: ${error.response.statusText}`);
                    } else {
                        toast.error('Network error. Please try again.');
                    }
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
            }
        }
        if (currentBid !== null && maxPrice !== null) {
            if (currentBid >= maxPrice) {
                console.log('Current bid matches or exceeds the max price. Auction may end or user can buy now.');
                handleAuctionEnd()
            } else {
                console.log('Current bid updated:', currentBid);
            }
        }
    }, [currentBid, maxPrice]);

    const handleCountdownComplete = () => {
        if (!live) {
            // Auction has just started
            setLive(true);
            setCountdownDate(new Date(details.auctionEndTime).getTime());
        } else {
            // Auction has ended
            handleAuctionEnd();
        }
    };
    
    useEffect(() => {
        // Re-render countdown component when countdownDate changes
        console.log('Updated Countdown Date:', countdownDate);
    }, [countdownDate]);

    const handleAuctionEnd = async () => {
        try {
            const res = await Api.handleAuctionEnd(details._id);
            console.log('Auction ended:', res);
            setAuctionEnd(true);
            if (res.status === 'Sold') {
                setSold(true);
                setFinalPrice(res.product.finalPrice);
                setBuyerId(res.product.boughtBy);
            } else if (res.status === 'Withdrawn') {
                setWithdrawn(true);
            }
        } catch (error) {
            console.error('Failed to end auction:', error);
        }
    };
    
    useEffect(() => {
        if (!prodDetailsId) return; // Ensure prodDetailsId is available before setting up the listener
    
        socket.on('bidUpdated', ({ productId: updatedId, currentBid, activeBidders, numberOfBids,bidderId }) => {
            console.log('Socket event received:', { productId: prodDetailsId, updatedId, currentBid, numberOfBids });
            if (updatedId === prodDetailsId) {
                setDetails((prevDetails) => ({
                    ...prevDetails,
                    numberOfBids: numberOfBids,
                    activeBidders: activeBidders,
                    currentBid: currentBid,
                }));
                setActiveBidders(activeBidders);
                setLatestBidder(bidderId)
            }
        });

        socket.on('auctionEnded', ({ productId: updatedId, finalPrice, status, boughtBy }) => {
            console.log('Auction ended:', { productId: prodDetailsId, updatedId, finalPrice, status, boughtBy });
            if (updatedId === prodDetailsId) {
                setDetails((prevDetails) => ({
                    ...prevDetails,
                    finalPrice: finalPrice,
                    status: status,
                    boughtBy: boughtBy,
                }));
                setAuctionEnd(true)
                if (status === 'Sold') {
                    setSold(true);
                    setFinalPrice(finalPrice);
                    setBuyerId(boughtBy);
                } else if (status === 'Withdrawn') {
                    setWithdrawn(true);
                }
            }
        });

        socket.on('productSold', ({ productId, finalPrice, buyerId, status }) => {
            console.log('Product sold:', { productId: prodDetailsId, finalPrice, buyerId, status });
    
            if (productId === prodDetailsId) {
                setDetails((prevDetails) => ({
                    ...prevDetails,
                    finalPrice: finalPrice,
                    status: status,
                    boughtBy: buyerId, // Assuming buyerId is the ID of the buyer
                }));
                setSold(true);
                setFinalPrice(finalPrice);
                setBuyerId(buyerId);
            }
        });

        return () => {
            socket.off('bidUpdated');
            socket.off('auctionEnded');
            socket.off('productSold');
        };
    }, [prodDetailsId]);

    useEffect(()=>{
        const getLatestBidder = async () => {
            try {
                console.log('lb',latestBidder)
                const res = await Api.getUserById(latestBidder)
                setLatestBidderUsername(res.userName)
            } catch (e) {
                console.log(e)
            }
        }
        if(latestBidder) {
            getLatestBidder()
        }
    },[latestBidder])

    return (
        <>
            <Header />
            <div className="bg-black">
                <div className="w-full container mx-auto relative">
                    <div className="text-center font-lora text-3xl text-white py-10">
                        Product Detail
                    </div>
                    {prodNotFound ? <>
                        <div className="text-center font-lora text-3xl text-white py-10">
                            Product Not Found
                        </div></> : <>
                        <div className="grid grid-cols-2 text-white gap-10">
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer">
                                <img src={`${Helper.BASE_URL}${details?.images}`} alt={`${details?.name}`} />
                                <div className="absolute bottom-0 w-full">
                                    <div className="mb-4 px-5 w-1/2">
                                        {auctionEnd ? (
                                            <div className="bg-[#212121] text-white p-2 text-center">
                                                Auction Time Has Ended
                                            </div>
                                        ) : countdownDate ? (
                                            <>
                                                {sold ? (<>
                                                    <div className="bg-[#212121] text-white p-2 text-center">
                                                        Auction Has Ended
                                                    </div>
                                                </>) : (<>
                                                    <div className="bg-[#212121] text-white p-2 text-center">
                                                        {live ? 'Live' : 'Auction Till Live'}
                                                    </div>
                                                    <Countdown
                                                    key={countdownDate} // Force re-render when countdownDate changes 
                                                    date={countdownDate} renderer={renderer}  onComplete={handleCountdownComplete} />
                                                </>)
                                                }

                                            </>
                                        ) : (
                                            <div>Loading...</div>
                                        )}
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
                                <div className="flex justify-between items-center">
                                <div className="text-3xl text-white">
                                    {details?.name}
                                </div>
                                {latestBidderUsername && <span className="text-end">Latest Bidder: {latestBidderUsername} </span>}
                                </div>
                                <div className="flex justify-between items-center border border-y-2 border-black border-x-0 py-2">
                                    <div className="flex items-center gap-x-2">
                                        <div className="bg-black px-3 py-2 rounded-full">
                                            <FontAwesomeIcon className="text-base" icon={faUser} />
                                        </div>
                                        <div>
                                            <div className="text-base hover:text-[#AD8B73]">
                                                {creator?.userName}
                                            </div>
                                            <Link to={`/user/${creator?.userName}`}>
                                                <div className="text-sm hover:text-[#AD8B73]">
                                                    Contact Seller
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={24}
                                activeColor="#fff"
                            /> */}
                                </div>
                                <div className="grid grid-cols-2 gap-y-3">
                                    <div>Current Bid</div>
                                    <div className="text-end">Rs. {details?.currentBid == 0 ? details?.startingPrice : details?.currentBid}</div>
                                    <div>No. of Bids</div>
                                    <div className="text-end">{details?.numberOfBids}</div>
                                    <div>Active Bidders</div>
                                    <div className="flex justify-end">
                                        <div onClick={openBidderModal} className="bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md text-center w-20 cursor-pointer">
                                            View
                                        </div>
                                    </div>
                                    {isBidderModal && (
                                        <ActiveBiddersModal
                                            activeBidders={usernames}
                                            onClose={closeBidderModal}
                                        />
                                    )}
                                    <div>Max Price</div>
                                    <div className="text-end">Rs. {details?.buyNowPrice}</div>
                                </div>
                                {same ? <></>
                                    :
                                    <>
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
                                    </>}
                                {same ?
                                    <>{sold ? <>
                                    <div>
                                                Auction has been won by <Link to={`/user/${winnerUserName}`}><span className="hover:text-amber-800">{winnerUserName}</span></Link> at Rs. {finalPrice}
                                            </div>
                                    </> : <>
                                    <div className="flex gap-x-5">
                                            <div
                                                onClick={openModal}
                                                className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-1/2'>
                                                Edit Product
                                            </div>
                                            <div onClick={openDeleteModal} className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-1/2'>
                                                Delete Product
                                            </div>
                                        </div>
                                        {showModal && (
                                            <EditProductModal
                                                product={details}
                                                onClose={closeModal}
                                                onSave={handleSave}
                                            />
                                        )}
                                        <ConfirmationModal
                                            isOpen={openDModal}
                                            onClose={closeDeleteModal}
                                            onConfirm={handleDeleteProduct}
                                        /></>}
                                        
                                    </>
                                    :
                                    <>
                                        {sold ? (<>{buyerId == userid ? (<>
                                            <div className="flex gap-x-5">
                                                <Link to={'/checkout'}>
                                                <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-full'>
                                                    Proceed to checkout <FontAwesomeIcon icon={faCartShopping} />
                                                </div>
                                                </Link>
                                            </div>
                                        </>) : (<>
                                            <div>
                                                Auction has been won by <Link to={`/user/${winnerUserName}`}><span className="hover:text-amber-800">{winnerUserName}</span></Link> at Rs. {finalPrice}
                                            </div>
                                            
                                        </>)}</>) : (<>
                                            <div className="flex gap-x-5">
                                                <div onClick={handleBidNowClick} className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-1/2'>
                                                    Bid Now <FontAwesomeIcon icon={faGavel} />
                                                </div>
                                                <div onClick={handleBuyNowClick} className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-1/2'>
                                                    Buy Now <FontAwesomeIcon icon={faCartShopping} />
                                                </div>
                                            </div>
                                            <ConfirmModal
                                                show={buyNowModal} 
                                                onClose={handleClose} 
                                                onConfirm={handleConfirm} 
                                                maxPrice={maxPrice}
                                            />
                                            {/* <div className="flex gap-x-5">
                                                <div onClick={handleAddToCartClick} className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-center text-[15px] py-2 px-5 w-full'>
                                                    Add to Cart <FontAwesomeIcon icon={faCartShopping} />
                                                </div>
                                            </div> */}
                                            </>)}
                                    </>}
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
                                <div className="flex justify-between items-center">
                                    <div className="text-2xl font-lora text-white mt-4">
                                        Product Specifications
                                    </div>
                                    {/* {same ? 
                            <>
                            <button className="bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md">
                                Edit
                            </button>
                            </> : 
                            <>
                            </>} */}
                                </div>
                                {prodDetails && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4 text-white my-2">
                                            <div><span className="font-bold">Battery Power:</span> {prodDetails.battery_power} mAh</div>
                                            <div><span className="font-bold">Bluetooth:</span> {prodDetails.blue ? "Yes" : "No"}</div>
                                            <div><span className="font-bold">Clock Speed:</span> {prodDetails.clock_speed} GHz</div>
                                            <div><span className="font-bold">Dual SIM:</span> {prodDetails.dual_sim ? "Yes" : "No"}</div>
                                            <div><span className="font-bold">Front Camera:</span> {prodDetails.fc} MP</div>
                                            <div><span className="font-bold">4G Support:</span> {prodDetails.four_g ? "Yes" : "No"}</div>
                                            <div><span className="font-bold">Internal Memory:</span> {prodDetails.int_memory} GB</div>
                                            <div><span className="font-bold">Mobile Depth:</span> {prodDetails.m_dep} cm</div>
                                            <div><span className="font-bold">Weight:</span> {prodDetails.mobile_wt} g</div>
                                            <div><span className="font-bold">Number of Cores:</span> {prodDetails.n_cores}</div>
                                            <div><span className="font-bold">Primary Camera:</span> {prodDetails.pc} MP</div>
                                            <div><span className="font-bold">Pixel Height:</span> {prodDetails.px_height} px</div>
                                            <div><span className="font-bold">Pixel Width:</span> {prodDetails.px_width} px</div>
                                            <div><span className="font-bold">RAM:</span> {prodDetails.ram} MB</div>
                                            <div><span className="font-bold">Screen Height:</span> {prodDetails.sc_h} cm</div>
                                            <div><span className="font-bold">Screen Width:</span> {prodDetails.sc_w} cm</div>
                                            <div><span className="font-bold">Talk Time:</span> {prodDetails.talk_time} hours</div>
                                            <div><span className="font-bold">3G Support:</span> {prodDetails.three_g ? "Yes" : "No"}</div>
                                            <div><span className="font-bold">Touch Screen:</span> {prodDetails.touch_screen ? "Yes" : "No"}</div>
                                            <div><span className="font-bold">WiFi Support:</span> {prodDetails.wifi ? "Yes" : "No"}</div>
                                            <div className="col-span-2">
                                                <span className="font-bold">Price Range:</span> {(() => {
                                                    switch (prodDetails.price_range) {
                                                        case 0: return "Rs. 5000 - Rs. 15000";
                                                        case 1: return "Rs. 15000 - Rs. 25000";
                                                        case 2: return "Rs. 25000 - Rs. 50000";
                                                        case 3: return "Rs. 50000+";
                                                        default: return "Unknown";
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                    </>}
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
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    theme="dark"
                />
            </div>
            <Footer />
        </>
    )
}
export default ProductDetails