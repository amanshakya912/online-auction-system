import { useEffect, useState } from "react";
import Api from "../utils/Api";
import Helper from "../utils/Helper";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import { SkeletonsGrid } from "./SkeletonLoader";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faClock } from "@fortawesome/free-solid-svg-icons";

const CountdownRenderer = ({ days, hours, minutes, seconds }) => (
    <div className="flex items-center gap-1">
        {[
            { val: days, label: "D" },
            { val: hours, label: "H" },
            { val: minutes, label: "M" },
            { val: seconds, label: "S" },
        ].map(({ val, label }, i) => (
            <div key={label} className="flex items-center gap-1">
                <div className="flex flex-col items-center min-w-[36px] bg-black/30 backdrop-blur-sm rounded-md px-2 py-1 border border-white/10">
                    <span className="font-lora font-bold text-white text-base leading-none">
                        {String(val).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] text-white/60 uppercase tracking-wider mt-0.5">{label}</span>
                </div>
                {i < 3 && <span className="text-white/40 text-sm font-bold mb-2">:</span>}
            </div>
        ))}
    </div>
);

const UpcomingAuction = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const productData = async () => {
            try {
                setLoading(true);
                const res = await Api.getProducts();
                const currentTime = new Date();
                const upcomingProducts = res.filter((p) => currentTime < new Date(p.auctionStartTime));
                setProducts(upcomingProducts);
            } catch (e) {
                console.error("Error fetching upcoming auctions:", e);
            } finally {
                setLoading(false);
            }
        };
        productData();
    }, []);

    return (
        <section className="relative py-16 overflow-hidden">
            {/* Warm textured background */}
            <div className="absolute inset-0 bg-primary" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80" />
            {/* Subtle noise-like pattern via repeating gradient */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
            />

            <div className="relative z-10 container mx-auto px-6">
                {/* Section header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-status-upcoming animate-pulse" />
                            <span className="text-xs font-semibold text-status-upcoming uppercase tracking-[0.18em]">Starting Soon</span>
                        </div>
                        <h2 className="font-lora font-bold text-3xl md:text-4xl text-white">Upcoming Auctions</h2>
                    </div>
                    <Link
                        to="/browse-auction/upcoming"
                        className="hidden sm:flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors duration-150 group"
                    >
                        View all
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-0.5 transition-transform duration-150" />
                    </Link>
                </div>

                {loading ? (
                    <SkeletonsGrid count={2} />
                ) : products.length > 0 ? (
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                        {products.slice(0, 2).map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            >
                                <Link to={`/${product.slug}`}>
                                    <div className="group relative bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-modal flex flex-col">
                                        {/* Image */}
                                        <div className="relative overflow-hidden aspect-[16/9]">
                                            <img
                                                src={`${Helper.BASE_URL}${product.images[0]}`}
                                                alt={product.name}
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x450/212121/A27B5C?text=No+Image"; }}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                                            />
                                            {/* Upcoming badge */}
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-status-upcoming/30 rounded-full px-3 py-1">
                                                <FontAwesomeIcon icon={faClock} className="text-status-upcoming text-xs" />
                                                <span className="text-xs font-semibold text-status-upcoming">Upcoming</span>
                                            </div>
                                            {/* Countdown */}
                                            <div className="absolute bottom-3 left-3">
                                                <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1.5">Starts in</p>
                                                <Countdown
                                                    date={new Date(product.auctionStartTime)}
                                                    renderer={CountdownRenderer}
                                                />
                                            </div>
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg transition-all duration-150">
                                                    View Details
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card info */}
                                        <div className="px-5 py-4 flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-white font-semibold text-base truncate">{product.name}</p>
                                                <p className="text-white/60 text-sm mt-0.5">
                                                    Starting at: <span className="text-white/90 font-semibold">{product.startingPrice}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-white/60">
                        <FontAwesomeIcon icon={faClock} className="text-3xl text-white/30 mb-4 block" />
                        No upcoming auctions scheduled.
                    </div>
                )}

                {/* Mobile view all */}
                <div className="sm:hidden flex justify-center mt-8">
                    <Link to="/browse-auction/upcoming">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-black/30 border border-white/15 hover:border-white/30 text-white text-sm font-medium rounded-lg transition-all duration-150">
                            Show All Upcoming
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default UpcomingAuction;