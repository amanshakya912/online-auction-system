import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Api from "../utils/Api";
import Helper from "../utils/Helper";
import Countdown from "react-countdown";
import { SkeletonsGrid } from "../Components/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFire, faClock, faHistory, faLayerGroup,
    faSearch, faChevronDown, faGavel, faTag,
} from "@fortawesome/free-solid-svg-icons";

const CATEGORIES = ["All", "Art", "Electronics", "Vehicles", "Real Estate", "Collectibles"];

const SLUG_META = {
    live:     { label: "Live Auctions",     eyebrow: "Live Now",      eyebrowColor: "text-status-live",     dotColor: "bg-status-live",     icon: faFire },
    upcoming: { label: "Upcoming Auctions", eyebrow: "Starting Soon", eyebrowColor: "text-status-upcoming", dotColor: "bg-status-upcoming", icon: faClock },
    recent:   { label: "Recent Auctions",   eyebrow: "Completed",     eyebrowColor: "text-text-disabled",   dotColor: "bg-text-disabled",   icon: faHistory },
    search:   { label: "Search Results",    eyebrow: "Browsing",      eyebrowColor: "text-text-disabled",   dotColor: "bg-text-disabled",   icon: faSearch },
    default:  { label: "All Auctions",      eyebrow: "Browse",        eyebrowColor: "text-text-disabled",   dotColor: "bg-text-disabled",   icon: faLayerGroup },
};

const CountdownRenderer = ({ days, hours, minutes, seconds }) => (
    <div className="flex items-center gap-1">
        {[{ val: days, label: "D" }, { val: hours, label: "H" }, { val: minutes, label: "M" }, { val: seconds, label: "S" }]
            .map(({ val, label }, i) => (
                <div key={label} className="flex items-center gap-1">
                    <div className="flex flex-col items-center min-w-[34px] bg-black/50 backdrop-blur-sm rounded-md px-1.5 py-1 border border-white/10">
                        <span className="font-lora font-bold text-white text-sm leading-none">
                            {String(val).padStart(2, "0")}
                        </span>
                        <span className="text-[8px] text-white/50 uppercase tracking-wider mt-0.5">{label}</span>
                    </div>
                    {i < 3 && <span className="text-white/30 text-xs font-bold mb-2">:</span>}
                </div>
            ))}
    </div>
);

const StatusBadge = ({ product, slug }) => {
    if (slug === "live") return (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-status-live/30 rounded-full px-2.5 py-1">
            <FontAwesomeIcon icon={faFire} className="text-status-live text-[10px]" />
            <span className="text-[10px] font-semibold text-status-live">Live</span>
        </div>
    );
    if (slug === "upcoming") return (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-status-upcoming/30 rounded-full px-2.5 py-1">
            <FontAwesomeIcon icon={faClock} className="text-status-upcoming text-[10px]" />
            <span className="text-[10px] font-semibold text-status-upcoming">Upcoming</span>
        </div>
    );
    if (slug === "recent") {
        const label = product.status === "Sold" ? "Sold" : "Ended";
        const cls = product.status === "Sold" ? "border-semantic-success/30 text-semantic-success" : "border-white/20 text-text-disabled";
        return (
            <div className={`absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border rounded-full px-2.5 py-1 ${cls}`}>
                <span className="text-[10px] font-semibold">{label}</span>
            </div>
        );
    }
    return null;
};

const AuctionCard = ({ product, slug, index }) => {
    const showCountdown = slug === "live" || slug === "upcoming";
    const countdownDate = slug === "live"
        ? new Date(product.auctionEndTime)
        : new Date(product.auctionStartTime);

    const currentBid = product.currentBid === 0 ? product.startingPrice : product.currentBid;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
            className="group relative bg-background-elevated rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-raised flex flex-col"
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[4/3]">
                <img
                    src={`${Helper.BASE_URL}${product.images[0]}`}
                    alt={product.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x450/212121/A27B5C?text=No+Image"; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <StatusBadge product={product} slug={slug} />

                {/* Countdown on image */}
                {showCountdown && (
                    <div className="absolute bottom-3 left-3">
                        <Countdown date={countdownDate} renderer={CountdownRenderer} />
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link to={`/${product.slug}`}>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95">
                            <FontAwesomeIcon icon={faGavel} className="text-xs" />
                            {slug === "recent" ? "View Details" : "Bid Now"}
                        </button>
                    </Link>
                </div>
            </div>

            {/* Card info */}
            <div className="px-4 py-3 flex flex-col gap-2 flex-1">
                <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[10px] text-text-disabled uppercase tracking-wider">
                            {slug === "upcoming" ? "Starting at" : "Current bid"}
                        </p>
                        <p className="text-primary text-sm font-semibold mt-0.5">Rs. {currentBid}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-text-disabled text-xs justify-end">
                            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                            <span>{product.numberOfBids ?? 0} bids</span>
                        </div>
                        {product.activeBidders?.length > 0 && (
                            <p className="text-[10px] text-text-disabled mt-0.5">{product.activeBidders.length} active</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const BrowseAuction = () => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || "";

    const [allAuctions, setAllAuctions] = useState([]);
    const [filteredAuctions, setFilteredAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [catOpen, setCatOpen] = useState(false);

    const meta = SLUG_META[slug] || SLUG_META.default;
    const title = slug === "search" && searchQuery
        ? `Results for "${searchQuery}"`
        : meta.label;

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                const res = await Api.getProducts();
                setAllAuctions(res);
            } catch (e) {
                console.error("Error fetching auctions:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAuctions();
    }, []);

    useEffect(() => {
        if (!allAuctions.length) return;
        const currentTime = new Date();
        let result = [...allAuctions];

        switch (slug) {
            case "live":
                result = result.filter((p) =>
                    new Date(p.auctionStartTime) <= currentTime &&
                    new Date(p.auctionEndTime) > currentTime &&
                    p.status === "Available"
                );
                break;
            case "upcoming":
                result = result.filter((p) =>
                    new Date(p.auctionStartTime) > currentTime && p.status === "Available"
                );
                break;
            case "recent":
                result = result.filter((p) =>
                    new Date(p.auctionEndTime) <= currentTime ||
                    ["Sold", "Withdrawn"].includes(p.status)
                );
                break;
            default:
                break;
        }

        if (searchQuery) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (categoryFilter !== "All") {
            result = result.filter((p) => p.category === categoryFilter);
        }

        setFilteredAuctions(result);
    }, [slug, allAuctions, searchQuery, categoryFilter]);

    return (
        <>
            <Header />

            <div className="bg-background-primary min-h-screen pt-20">
                {/* Page header */}
                <div className="border-b border-white/5 bg-background-secondary/50">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                            {/* Title */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor} ${slug === "live" ? "animate-pulse" : ""}`} />
                                    <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${meta.eyebrowColor}`}>
                                        {meta.eyebrow}
                                    </span>
                                </div>
                                <h1 className="font-lora font-bold text-3xl md:text-4xl text-white">{title}</h1>
                                {!loading && (
                                    <p className="text-text-disabled text-sm mt-2">
                                        {filteredAuctions.length} auction{filteredAuctions.length !== 1 ? "s" : ""} found
                                    </p>
                                )}
                            </div>

                            {/* Category filter */}
                            <div className="relative" onMouseLeave={() => setCatOpen(false)}>
                                <button
                                    onClick={() => setCatOpen(!catOpen)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 bg-background-elevated border border-white/8 hover:border-white/15 rounded-lg text-sm text-text-primary transition-all duration-150 min-w-[180px] justify-between"
                                >
                                    <span className="text-text-disabled text-xs mr-1">Category:</span>
                                    <span>{categoryFilter}</span>
                                    <motion.span animate={{ rotate: catOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
                                        <FontAwesomeIcon icon={faChevronDown} className="text-xs text-text-disabled" />
                                    </motion.span>
                                </button>

                                <AnimatePresence>
                                    {catOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-1.5 w-full bg-background-elevated border border-white/8 rounded-xl shadow-modal overflow-hidden z-dropdown"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => { setCategoryFilter(cat); setCatOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100 ${
                                                        categoryFilter === cat
                                                            ? "bg-primary/15 text-primary"
                                                            : "text-text-primary hover:bg-white/5"
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="container mx-auto px-6 py-10">
                    {loading ? (
                        <SkeletonsGrid count={8} />
                    ) : filteredAuctions.length > 0 ? (
                        <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                            {filteredAuctions.map((product, i) => (
                                <AuctionCard
                                    key={product._id}
                                    product={product}
                                    slug={slug}
                                    index={i}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-14 h-14 rounded-full bg-background-elevated border border-white/5 flex items-center justify-center mb-5">
                                <FontAwesomeIcon icon={meta.icon} className="text-text-disabled text-lg" />
                            </div>
                            <p className="text-white font-semibold text-lg mb-1">No auctions found</p>
                            <p className="text-text-secondary text-sm max-w-xs">
                                {categoryFilter !== "All"
                                    ? `No ${meta.label.toLowerCase()} match the "${categoryFilter}" category. Try a different filter.`
                                    : `There are no ${meta.label.toLowerCase()} at the moment. Check back soon.`}
                            </p>
                            {categoryFilter !== "All" && (
                                <button
                                    onClick={() => setCategoryFilter("All")}
                                    className="mt-5 px-5 py-2 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default BrowseAuction;