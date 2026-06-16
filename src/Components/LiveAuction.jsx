import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel, faArrowRight, faFire } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import Api from "../utils/Api";
import { Link } from "react-router-dom";
import Helper from "../utils/Helper";
import { SkeletonsGrid } from "./SkeletonLoader";
import { motion } from "framer-motion";

const CountdownRenderer = ({ days, hours, minutes, seconds }) => (
    <div className="flex items-center gap-1">
        {[
            { val: days, label: "D" },
            { val: hours, label: "H" },
            { val: minutes, label: "M" },
            { val: seconds, label: "S" },
        ].map(({ val, label }, i) => (
            <div key={label} className="flex items-center gap-1">
                <div className="flex flex-col items-center min-w-[36px] bg-black/40 rounded-md px-2 py-1">
                    <span className="font-lora font-bold text-white text-base leading-none">
                        {String(val).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] text-text-disabled uppercase tracking-wider mt-0.5">{label}</span>
                </div>
                {i < 3 && <span className="text-text-disabled text-sm font-bold mb-2">:</span>}
            </div>
        ))}
    </div>
);

const LiveAuction = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await Api.getProducts();
                const currentTime = new Date();
                const liveProducts = (res.data || res).filter((p) => {
                    const end = new Date(p.auctionEndTime);
                    const start = new Date(p.auctionStartTime);
                    return currentTime < end && currentTime >= start && p.status !== "Sold";
                });
                setProducts(liveProducts);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="bg-background-primary py-16">
            <div className="container mx-auto px-6">
                {/* Section header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="font-lora font-bold text-3xl md:text-4xl text-white">Live Auctions</h2>
                    </div>
                    <Link
                        to="/browse-auction/live"
                        className="hidden sm:flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors duration-150 group"
                    >
                        View all
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-0.5 transition-transform duration-150" />
                    </Link>
                </div>

                {loading ? (
                    <SkeletonsGrid count={2} />
                ) : products.length > 0 ? (
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                        {products.map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="group relative bg-background-elevated rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-raised flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden aspect-[16/9]">
                                    <img
                                        src={`${Helper.BASE_URL}${product.images[0]}`}
                                        alt={product.name}
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x450/212121/A27B5C?text=No+Image"; }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Live badge */}
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-status-live/30 rounded-full px-3 py-1">
                                        <FontAwesomeIcon icon={faFire} className="text-status-live text-xs" />
                                        <span className="text-xs font-semibold text-status-live">Live</span>
                                    </div>
                                    {/* Countdown overlay */}
                                    <div className="absolute bottom-3 left-3">
                                        <Countdown
                                            date={new Date(product.auctionEndTime)}
                                            renderer={CountdownRenderer}
                                        />
                                    </div>
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Link to={`/${product.slug}`}>
                                            <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg transition-all duration-150 hover:shadow-glow active:scale-95">
                                                <FontAwesomeIcon icon={faGavel} />
                                                Bid Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Card info */}
                                <div className="px-5 py-4 flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-white font-semibold text-base truncate">{product.name}</p>
                                        <p className="text-text-secondary text-sm mt-0.5">
                                            Current bid: <span className="text-primary font-semibold">{product.currentBid}</span>
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-white text-sm font-medium">{product.numberOfBids}</p>
                                        <p className="text-text-disabled text-xs mt-0.5">Bids</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-white text-sm font-medium">{product.activeBidders?.length ?? 0}</p>
                                        <p className="text-text-disabled text-xs mt-0.5">Bidders</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-text-secondary">
                        <FontAwesomeIcon icon={faGavel} className="text-3xl text-text-disabled mb-4 block" />
                        No live auctions at the moment.
                    </div>
                )}

                {/* Mobile "view all" */}
                <div className="sm:hidden flex justify-center mt-8">
                    <Link to="/browse-auction/live">
                        <button className="flex items-center gap-2 px-6 py-2.5 border border-white/10 hover:border-white/20 text-text-primary text-sm font-medium rounded-lg transition-all duration-150 hover:bg-white/5">
                            Show All Live Auctions
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LiveAuction;