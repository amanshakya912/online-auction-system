import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faArrowRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import banner1 from '../images/banner1.jpg';

const STATS = [
    { value: "12K+", label: "Active Bidders" },
    { value: "3.2K", label: "Live Auctions" },
    { value: "₹2.4Cr", label: "Total Traded" },
];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const Banner = () => {
    return (
        <section className="relative w-full min-h-screen flex items-center overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src={banner1}
                    alt="Auction background"
                    className="w-full h-full object-cover"
                />
                {/* Multi-layer gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                {/* Subtle warm tint on the right */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />
            </div>

            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
                <div className="max-w-2xl">
                    {/* Eyebrow */}
                    <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2.5 mb-7">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">
                            Trusted Auction Platform
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        {...fadeUp(0.2)}
                        className="font-lora font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] tracking-tight mb-6"
                    >
                        Bid Smart,{" "}
                        <span className="text-primary">Win</span>{" "}
                        More
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        {...fadeUp(0.3)}
                        className="text-text-secondary text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
                    >
                        Discover rare finds, unique collectibles, and premium goods, all in one secure marketplace.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center gap-4 mb-14">
                        <Link to="/browse-auction/live">
                            <button className="group flex items-center gap-2.5 px-7 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-lg transition-all duration-200 hover:shadow-glow active:scale-95">
                                <FontAwesomeIcon icon={faGavel} className="text-sm" />
                                Browse Live Auctions
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                                />
                            </button>
                        </Link>
                        <Link to="/create-auction">
                            <button className="flex items-center gap-2 px-7 py-3.5 border border-white/15 hover:border-white/30 text-white font-semibold text-sm rounded-lg backdrop-blur-sm hover:bg-white/5 transition-all duration-200 active:scale-95">
                                Start Selling
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] text-text-disabled uppercase tracking-[0.2em]">Scroll</span>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                >
                    <FontAwesomeIcon icon={faChevronDown} className="text-text-disabled text-xs" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Banner;