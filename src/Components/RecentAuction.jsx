import { useState, useEffect } from "react";
import Api from "../utils/Api";
import Helper from "../utils/Helper";
import { Link } from "react-router-dom";
import { SkeletonsGrid } from "./SkeletonLoader";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHistory, faTag } from "@fortawesome/free-solid-svg-icons";

const RecentAuction = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const productData = async () => {
            try {
                setLoading(true);
                const res = await Api.getProducts();
                const currentTime = new Date();
                const recentProducts = res.filter((p) => {
                    const endTime = new Date(p.auctionEndTime);
                    return currentTime > endTime || ["Sold", "Withdrawn"].includes(p.status);
                });
                setProducts(recentProducts);
            } catch (e) {
                console.error("Error fetching products:", e);
            } finally {
                setLoading(false);
            }
        };
        productData();
    }, []);

    const getStatusLabel = (product) => {
        if (product.status === "Sold") return { label: "Sold", cls: "text-semantic-success border-semantic-success/30" };
        if (product.status === "Withdrawn") return { label: "Withdrawn", cls: "text-text-disabled border-text-disabled/30" };
        return { label: "Ended", cls: "text-text-disabled border-text-disabled/30" };
    };

    return (
        <section className="bg-background-secondary py-16 border-t border-white/5">
            <div className="container mx-auto px-6">
                {/* Section header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faHistory} className="text-xs text-text-disabled" />
                            <span className="text-xs font-semibold text-text-disabled uppercase tracking-[0.18em]">Completed</span>
                        </div>
                        <h2 className="font-lora font-bold text-3xl md:text-4xl text-white">Recent Auctions</h2>
                    </div>
                    <Link
                        to="/browse-auction/recent"
                        className="hidden sm:flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors duration-150 group"
                    >
                        View all
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-0.5 transition-transform duration-150" />
                    </Link>
                </div>

                {loading ? (
                    <SkeletonsGrid count={4} />
                ) : products.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-4">
                        {products.slice(0, 4).map((product, i) => {
                            const status = getStatusLabel(product);
                            return (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: i * 0.08 }}
                                    className="group relative bg-background-elevated rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-raised flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="relative overflow-hidden aspect-square">
                                        <img
                                            src={`${Helper.BASE_URL}${product.images[0]}`}
                                            alt={product.name}
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x600/212121/A27B5C?text=No+Image"; }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                                        />
                                        {/* Status badge */}
                                        <div className={`absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider border rounded-full px-2.5 py-0.5 bg-black/50 backdrop-blur-sm ${status.cls}`}>
                                            {status.label}
                                        </div>
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Link to={`/${product.slug}`}>
                                                <button className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Card info */}
                                    <div className="px-4 py-3 flex flex-col gap-1 flex-1">
                                        <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                                        <div className="flex items-center justify-between mt-auto pt-2">
                                            <div className="flex items-center gap-1.5 text-text-disabled text-xs">
                                                <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                                                <span>{product.bids ?? 0} bids</span>
                                            </div>
                                            {product.finalPrice && (
                                                <span className="text-xs text-text-secondary font-medium">
                                                    {product.finalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 text-text-secondary">
                        <FontAwesomeIcon icon={faHistory} className="text-3xl text-text-disabled mb-4 block" />
                        No recent auctions available.
                    </div>
                )}

                {/* Mobile view all */}
                <div className="sm:hidden flex justify-center mt-8">
                    <Link to="/browse-auction/recent">
                        <button className="flex items-center gap-2 px-6 py-2.5 border border-white/10 hover:border-white/20 text-text-primary text-sm font-medium rounded-lg transition-all duration-150 hover:bg-white/5">
                            Show All Recent
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecentAuction;