import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import {
    faCartShopping, faGavel, faUser, faFire, faClock,
    faChevronRight, faTag, faLayerGroup, faBolt,
    faUsers, faArrowLeft, faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import RecentAuction from "../Components/RecentAuction";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../utils/Api";
import Helper from "../utils/Helper";
import BidModal from "../Components/BidModal";
import EditProductModal from "../Components/EditProductModal";
import ConfirmationModal from "../Components/ConfirmationModal";
import { ToastContainer, toast } from "react-toastify";
import ActiveBiddersModal from "../Components/ActiveBiddersModal";
import axios from "axios";
import io from "socket.io-client";
import ConfirmModal from "../Components/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";

const socket = io(Helper.BASE_URL);

// ─── Countdown renderer ───────────────────────────────────────────────────────
const CountdownRenderer = ({ days, hours, minutes, seconds }) => (
    <div className="flex items-center gap-1.5">
        {[{ val: days, label: "Days" }, { val: hours, label: "Hrs" }, { val: minutes, label: "Min" }, { val: seconds, label: "Sec" }]
            .map(({ val, label }, i) => (
                <div key={label} className="flex items-center gap-1.5">
                    <div className="flex flex-col items-center bg-background-primary rounded-lg px-3 py-2 min-w-[52px] border border-white/8">
                        <span className="font-lora font-bold text-white text-xl leading-none">
                            {String(val).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] text-text-disabled uppercase tracking-wider mt-1">{label}</span>
                    </div>
                    {i < 3 && <span className="text-text-disabled font-bold mb-3">:</span>}
                </div>
            ))}
    </div>
);

// ─── Spec row ─────────────────────────────────────────────────────────────────
const SpecRow = ({ label, value }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-sm text-white font-medium">{value}</span>
    </div>
);

const PRICE_RANGE_MAP = {
    0: "Rs. 5,000 – 15,000",
    1: "Rs. 15,000 – 25,000",
    2: "Rs. 25,000 – 50,000",
    3: "Rs. 50,000+",
};

// ─── Main component ───────────────────────────────────────────────────────────
const ProductDetails = () => {
    const userid = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const { slug } = useParams();
    const navigate = useNavigate();

    const [details, setDetails] = useState(null);
    const [prodDetails, setProdDetails] = useState(null);
    const [prodDetailsId, setProdDetailsId] = useState(null);
    const [creatorId, setCreatorId] = useState(null);
    const [creator, setCreator] = useState(null);
    const [same, setSame] = useState(false);

    const [live, setLive] = useState(false);
    const [auctionEnd, setAuctionEnd] = useState(false);
    const [countdownDate, setCountdownDate] = useState(null);
    const [sold, setSold] = useState(false);
    const [withdrawn, setWithdrawn] = useState(false);

    const [currentBid, setCurrentBid] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [finalPrice, setFinalPrice] = useState(null);
    const [buyerId, setBuyerId] = useState(null);
    const [winnerUserName, setWinnerUserName] = useState(null);
    const [latestBidder, setLatestBidder] = useState(null);
    const [latestBidderUsername, setLatestBidderUsername] = useState(null);
    const [activeBidders, setActiveBidders] = useState([]);
    const [usernames, setUsernames] = useState([]);

    const [quantity, setQuantity] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [prodNotFound, setProdNotFound] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [openDModal, setOpenDModal] = useState(false);
    const [isBidderModal, setIsBidderModal] = useState(false);
    const [buyNowModal, setBuyNowModal] = useState(false);

    // ── fetch product ──────────────────────────────────────────────────────────
    useEffect(() => {
        const productDetails = async () => {
            try {
                const res = await Api.getProductBySlug(slug);
                setDetails(res);
                auctionCountdown(res.auctionStartTime, res.auctionEndTime);
                setCreatorId(res.createdBy);
                setProdDetailsId(res._id);
                setActiveBidders(res.activeBidders);
                setCurrentBid(res.currentBid);
                setMaxPrice(res.buyNowPrice);
                if (res.finalPrice) setFinalPrice(res.finalPrice);
                if (res.boughtBy) setBuyerId(res.boughtBy);
                if (res.status === "Sold") setSold(true);
                else if (res.status === "Withdrawn") setWithdrawn(true);
            } catch {
                setProdNotFound(true);
            }
        };
        productDetails();
    }, [refreshKey]);

    useEffect(() => {
        const fetchUsernames = async () => {
            const names = await Promise.all(
                activeBidders.map(async (id) => {
                    try { return (await Api.getUserById(id)).userName; }
                    catch { return null; }
                })
            );
            setUsernames(names.filter(Boolean));
        };
        fetchUsernames();
    }, [activeBidders]);

    useEffect(() => {
        if (!creatorId) return;
        Api.getUserById(creatorId).then(setCreator).catch(() => {});
        setSame(creatorId === userid);
    }, [creatorId]);

    useEffect(() => {
        if (!prodDetailsId) return;
        Api.getProductDetailsById(prodDetailsId).then((r) => setProdDetails(r.productDetails)).catch(() => {});
    }, [prodDetailsId]);

    useEffect(() => {
        if (!buyerId) return;
        Api.getUserById(buyerId).then((r) => setWinnerUserName(r.userName)).catch(() => {});
    }, [buyerId]);

    useEffect(() => {
        if (!latestBidder) return;
        Api.getUserById(latestBidder).then((r) => setLatestBidderUsername(r.userName)).catch(() => {});
    }, [latestBidder]);

    // buy-now auto-end
    useEffect(() => {
        if (currentBid !== null && maxPrice !== null && currentBid >= maxPrice) {
            handleAuctionEnd();
        }
    }, [currentBid, maxPrice]);

    // socket
    useEffect(() => {
        if (!prodDetailsId) return;
        socket.on("bidUpdated", ({ productId: id, currentBid, activeBidders, numberOfBids, bidderId }) => {
            if (id !== prodDetailsId) return;
            setDetails((p) => ({ ...p, numberOfBids, activeBidders, currentBid }));
            setActiveBidders(activeBidders);
            setLatestBidder(bidderId);
        });
        socket.on("auctionEnded", ({ productId: id, finalPrice, status, boughtBy }) => {
            if (id !== prodDetailsId) return;
            setDetails((p) => ({ ...p, finalPrice, status, boughtBy }));
            setAuctionEnd(true);
            if (status === "Sold") { setSold(true); setFinalPrice(finalPrice); setBuyerId(boughtBy); }
            else if (status === "Withdrawn") setWithdrawn(true);
        });
        socket.on("productSold", ({ productId: id, finalPrice, buyerId, status }) => {
            if (id !== prodDetailsId) return;
            setDetails((p) => ({ ...p, finalPrice, status, boughtBy: buyerId }));
            setSold(true); setFinalPrice(finalPrice); setBuyerId(buyerId);
        });
        return () => { socket.off("bidUpdated"); socket.off("auctionEnded"); socket.off("productSold"); };
    }, [prodDetailsId]);

    // ── helpers ───────────────────────────────────────────────────────────────
    const auctionCountdown = (start, end) => {
        const now = Date.now();
        if (now < new Date(start).getTime()) {
            setCountdownDate(new Date(start).getTime());
        } else if (now < new Date(end).getTime()) {
            setLive(true);
            setCountdownDate(new Date(end).getTime());
        } else {
            setAuctionEnd(true);
        }
    };

    const handleAuctionEnd = async () => {
        try {
            const res = await Api.handleAuctionEnd(details._id);
            setAuctionEnd(true);
            if (res.status === "Sold") { setSold(true); setFinalPrice(res.product.finalPrice); setBuyerId(res.product.boughtBy); }
            else if (res.status === "Withdrawn") setWithdrawn(true);
        } catch { console.error("Failed to end auction"); }
    };

    const handleCountdownComplete = () => {
        if (!live) {
            setLive(true);
            setCountdownDate(new Date(details.auctionEndTime).getTime());
        } else {
            handleAuctionEnd();
        }
    };

    const handleBidSubmit = async (bidAmount) => {
        try {
            await Api.placeBid(details._id, bidAmount);
            toast.success("Bid placed successfully!");
            setRefreshKey((k) => k + 1);
        } catch { toast.error("Failed to place bid."); }
    };

    const handleConfirm = async () => {
        try {
            await Api.handleBuyNow(prodDetailsId);
            toast.success("Product purchased!");
            setRefreshKey((k) => k + 1);
        } catch { toast.error("Purchase failed."); }
        setBuyNowModal(false);
    };

    const handleDeleteProduct = async () => {
        try {
            await Api.deleteProduct(prodDetailsId);
            navigate("/");
        } catch { console.error("Error deleting product"); }
    };

    const requireAuth = (action) => {
        if (!token) { toast.info("Sign in to continue."); return; }
        if (!live) { toast.info("Auction is not live yet!"); return; }
        action();
    };

    const displayBid = details?.currentBid === 0 ? details?.startingPrice : details?.currentBid;

    // ── auction status badge ──────────────────────────────────────────────────
    const AuctionStatusPill = () => {
        if (sold) return (
            <span className="inline-flex items-center gap-1.5 bg-semantic-success/15 border border-semantic-success/30 text-semantic-success text-xs font-semibold px-3 py-1 rounded-full">
                Sold
            </span>
        );
        if (withdrawn) return (
            <span className="inline-flex items-center gap-1.5 bg-text-disabled/10 border border-text-disabled/20 text-text-disabled text-xs font-semibold px-3 py-1 rounded-full">
                Withdrawn
            </span>
        );
        if (live) return (
            <span className="inline-flex items-center gap-1.5 bg-status-live/15 border border-status-live/30 text-status-live text-xs font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-status-live animate-pulse" />
                Live
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1.5 bg-status-upcoming/15 border border-status-upcoming/30 text-status-upcoming text-xs font-semibold px-3 py-1 rounded-full">
                <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                Upcoming
            </span>
        );
    };

    return (
        <>
            <Header />
            <div className="bg-background-primary min-h-screen pt-20">
                {/* ── back nav ─────────────────────────────────────────────── */}
                <div className="border-b border-white/5 bg-background-secondary/40">
                    <div className="container mx-auto px-6 py-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors duration-150"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                            Back
                        </button>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-10">
                    {prodNotFound ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-14 h-14 rounded-full bg-background-elevated border border-white/5 flex items-center justify-center mb-5">
                                <FontAwesomeIcon icon={faTag} className="text-text-disabled text-lg" />
                            </div>
                            <p className="font-lora text-white text-2xl font-bold mb-2">Product Not Found</p>
                            <p className="text-text-secondary text-sm mb-6">This auction may have been removed or the link is incorrect.</p>
                            <Link to="/">
                                <button className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all">
                                    Back to Home
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* ── main grid ──────────────────────────────────── */}
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-8 items-start">
                                {/* Left — image + countdown */}
                                <div className="flex flex-col gap-4">
                                    <div className="relative rounded-2xl overflow-hidden bg-background-elevated border border-white/5 aspect-[4/3]">
                                        <img
                                            src={`${Helper.BASE_URL}${details?.images}`}
                                            alt={details?.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/212121/A27B5C?text=No+Image"; }}
                                        />
                                        {/* Live / upcoming badge */}
                                        <div className="absolute top-3 left-3">
                                            <AuctionStatusPill />
                                        </div>
                                    </div>

                                    {/* Countdown card */}
                                    <div className="bg-background-elevated rounded-2xl border border-white/5 px-5 py-4">
                                        {auctionEnd || sold ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-text-disabled/10 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faClock} className="text-text-disabled text-xs" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-text-disabled uppercase tracking-wider">Auction</p>
                                                    <p className="text-white font-semibold text-sm">Has Ended</p>
                                                </div>
                                            </div>
                                        ) : countdownDate ? (
                                            <div>
                                                <p className="text-xs text-text-disabled uppercase tracking-wider mb-3">
                                                    {live ? "Ends in" : "Starts in"}
                                                </p>
                                                <Countdown
                                                    key={countdownDate}
                                                    date={countdownDate}
                                                    renderer={CountdownRenderer}
                                                    onComplete={handleCountdownComplete}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-text-disabled text-sm">
                                                <div className="w-4 h-4 rounded-full border-2 border-text-disabled/30 border-t-text-disabled animate-spin" />
                                                Loading…
                                            </div>
                                        )}
                                    </div>

                                    {/* Latest bidder ticker */}
                                    <AnimatePresence>
                                        {latestBidderUsername && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-background-elevated rounded-xl border border-white/5 px-4 py-3 flex items-center gap-3"
                                            >
                                                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                                                    <FontAwesomeIcon icon={faFire} className="text-primary text-xs" />
                                                </div>
                                                <p className="text-sm text-text-secondary">
                                                    Latest bid by <span className="text-white font-semibold">{latestBidderUsername}</span>
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Right — details panel */}
                                <div className="flex flex-col gap-5">
                                    {/* Title */}
                                    <div>
                                        <h1 className="font-lora font-bold text-3xl text-white leading-tight mb-2">{details?.name}</h1>
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <FontAwesomeIcon icon={faLayerGroup} className="text-xs" />
                                            <span>{details?.category || "Uncategorized"}</span>
                                        </div>
                                    </div>

                                    {/* Seller */}
                                    <div className="bg-background-elevated rounded-xl border border-white/5 px-4 py-3 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                            <FontAwesomeIcon icon={faUser} className="text-primary text-sm" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-text-disabled uppercase tracking-wider">Seller</p>
                                            <p className="text-white text-sm font-semibold truncate">{creator?.userName}</p>
                                        </div>
                                        <Link to={`/user/${creator?.userName}`} className="ml-auto shrink-0">
                                            <span className="text-xs text-primary hover:text-primary-light transition-colors flex items-center gap-1">
                                                Contact <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Bid stats */}
                                    <div className="bg-background-elevated rounded-xl border border-white/5 overflow-hidden">
                                        <div className="grid grid-cols-3 divide-x divide-white/5">
                                            <div className="px-4 py-4">
                                                <p className="text-[10px] text-text-disabled uppercase tracking-wider mb-1">
                                                    {details?.currentBid === 0 ? "Starting at" : "Current bid"}
                                                </p>
                                                <p className="text-primary font-lora font-bold text-lg">Rs. {displayBid}</p>
                                            </div>
                                            <div className="px-4 py-4">
                                                <p className="text-[10px] text-text-disabled uppercase tracking-wider mb-1">Total bids</p>
                                                <p className="text-white font-bold text-lg">{details?.numberOfBids ?? 0}</p>
                                            </div>
                                            <div className="px-4 py-4">
                                                <p className="text-[10px] text-text-disabled uppercase tracking-wider mb-1">Bidders</p>
                                                <button
                                                    onClick={() => setIsBidderModal(true)}
                                                    className="flex items-center gap-1.5 text-white font-bold text-lg group"
                                                >
                                                    <FontAwesomeIcon icon={faUsers} className="text-sm text-text-disabled group-hover:text-primary transition-colors" />
                                                    {activeBidders.length}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="border-t border-white/5 px-4 py-3 flex items-center justify-between">
                                            <span className="text-xs text-text-disabled">Buy Now Price</span>
                                            <span className="text-sm text-white font-semibold">Rs. {details?.buyNowPrice}</span>
                                        </div>
                                    </div>

                                    {/* Quantity (buyer only) */}
                                    {!same && (
                                        <div className="bg-background-elevated rounded-xl border border-white/5 px-4 py-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-text-disabled uppercase tracking-wider">Quantity</p>
                                                <p className="text-text-secondary text-sm mt-0.5">{details?.quantity} available</p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-background-primary rounded-lg px-3 py-2 border border-white/8">
                                                <button
                                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                    className="text-white w-5 text-center hover:text-primary transition-colors"
                                                >−</button>
                                                <span className="text-white font-semibold w-5 text-center">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity((q) => Math.min(details?.quantity, q + 1))}
                                                    disabled={quantity >= details?.quantity}
                                                    className="text-white w-5 text-center hover:text-primary transition-colors disabled:opacity-30"
                                                >+</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Trust badge */}
                                    <div className="flex items-center gap-2 text-xs text-text-disabled">
                                        <FontAwesomeIcon icon={faShieldHalved} className="text-semantic-success" />
                                        Secure bidding · Verified seller · Buyer protection
                                    </div>

                                    {/* Action buttons */}
                                    {same ? (
                                        sold ? (
                                            <div className="bg-background-elevated rounded-xl border border-white/5 px-4 py-4 text-sm text-text-secondary">
                                                Won by{" "}
                                                <Link to={`/user/${winnerUserName}`}>
                                                    <span className="text-primary hover:text-primary-light transition-colors font-semibold">{winnerUserName}</span>
                                                </Link>{" "}
                                                at <span className="text-white font-semibold">Rs. {finalPrice}</span>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setShowModal(true)}
                                                    className="flex-1 py-3 bg-background-elevated hover:bg-white/8 border border-white/10 hover:border-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-150"
                                                >
                                                    Edit Product
                                                </button>
                                                <button
                                                    onClick={() => setOpenDModal(true)}
                                                    className="flex-1 py-3 bg-semantic-error/10 hover:bg-semantic-error/20 border border-semantic-error/20 hover:border-semantic-error/40 text-semantic-error text-sm font-semibold rounded-xl transition-all duration-150"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )
                                    ) : sold ? (
                                        buyerId === userid ? (
                                            <Link to="/checkout">
                                                <button className="w-full py-3.5 bg-semantic-success hover:bg-semantic-success/80 text-white font-semibold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2">
                                                    <FontAwesomeIcon icon={faCartShopping} />
                                                    Proceed to Checkout
                                                </button>
                                            </Link>
                                        ) : (
                                            <div className="bg-background-elevated rounded-xl border border-white/5 px-4 py-4 text-sm text-text-secondary">
                                                Won by{" "}
                                                <Link to={`/user/${winnerUserName}`}>
                                                    <span className="text-primary hover:text-primary-light font-semibold">{winnerUserName}</span>
                                                </Link>{" "}
                                                at <span className="text-white font-semibold">Rs. {finalPrice}</span>
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => requireAuth(() => setIsModalOpen(true))}
                                                className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-xl transition-all duration-150 hover:shadow-glow active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faGavel} />
                                                Bid Now
                                            </button>
                                            <button
                                                onClick={() => requireAuth(() => setBuyNowModal(true))}
                                                className="flex-1 py-3.5 bg-background-elevated hover:bg-white/8 border border-white/10 hover:border-white/20 text-white font-semibold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faBolt} />
                                                Buy Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── About + Specs ───────────────────────────────── */}
                            <div className="mt-10 grid md:grid-cols-2 grid-cols-1 gap-6">
                                {/* About */}
                                <div className="bg-background-elevated rounded-2xl border border-white/5 p-6">
                                    <h2 className="font-lora font-bold text-xl text-white mb-4">About This Item</h2>
                                    <p className="text-text-secondary text-sm leading-relaxed">{details?.description}</p>
                                </div>

                                {/* Specs */}
                                {prodDetails && (
                                    <div className="bg-background-elevated rounded-2xl border border-white/5 p-6">
                                        <h2 className="font-lora font-bold text-xl text-white mb-4">Specifications</h2>
                                        <SpecRow label="Battery" value={`${prodDetails.battery_power} mAh`} />
                                        <SpecRow label="Bluetooth" value={prodDetails.blue ? "Yes" : "No"} />
                                        <SpecRow label="Dual SIM" value={prodDetails.dual_sim ? "Yes" : "No"} />
                                        <SpecRow label="Front Camera" value={`${prodDetails.fc} MP`} />
                                        <SpecRow label="Internal Memory" value={`${prodDetails.int_memory} GB`} />
                                        <SpecRow label="CPU Cores" value={prodDetails.n_cores} />
                                        <SpecRow label="Primary Camera" value={`${prodDetails.pc} MP`} />
                                        <SpecRow label="Resolution" value={`${prodDetails.px_width} × ${prodDetails.px_height} px`} />
                                        <SpecRow label="RAM" value={`${prodDetails.ram} MB`} />
                                        <SpecRow label="WiFi" value={prodDetails.wifi ? "Yes" : "No"} />
                                        <SpecRow label="Price Range" value={PRICE_RANGE_MAP[prodDetails.price_range] ?? "Unknown"} />
                                    </div>
                                )}
                            </div>

                            {/* ── Recent auctions ─────────────────────────────── */}
                            <div className="mt-10">
                                <RecentAuction />
                            </div>
                        </>
                    )}
                </div>

                {/* ── Modals ──────────────────────────────────────────────────── */}
                <BidModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    productName={details?.name}
                    startingPrice={details?.startingPrice}
                    currentBid={details?.currentBid}
                    bidIncrement={details?.bidIncrement}
                    onBidSubmit={handleBidSubmit}
                />
                {showModal && (
                    <EditProductModal
                        product={details}
                        onClose={() => setShowModal(false)}
                        onSave={() => { toast.success("Product updated!"); setRefreshKey((k) => k + 1); }}
                    />
                )}
                <ConfirmationModal
                    isOpen={openDModal}
                    onClose={() => setOpenDModal(false)}
                    onConfirm={handleDeleteProduct}
                />
                <ConfirmModal
                    show={buyNowModal}
                    onClose={() => setBuyNowModal(false)}
                    onConfirm={handleConfirm}
                    maxPrice={maxPrice}
                />
                {isBidderModal && (
                    <ActiveBiddersModal
                        activeBidders={usernames}
                        onClose={() => setIsBidderModal(false)}
                    />
                )}

                <ToastContainer position="top-right" autoClose={5000} theme="dark" />
            </div>
            <Footer />
        </>
    );
};

export default ProductDetails;