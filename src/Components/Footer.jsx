import { useState } from "react";
import { motion } from "framer-motion";
import { faEnvelope, faPhone, faGavel } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { showToast } from "../config/toastConfig.jsx";

const SOCIAL = [
    { icon: faFacebook, url: "#", label: "Facebook" },
    { icon: faTwitter, url: "#", label: "Twitter" },
    { icon: faInstagram, url: "#", label: "Instagram" },
    { icon: faLinkedin, url: "#", label: "LinkedIn" },
];

const QUICK_LINKS = [
    { label: "Home", to: "/" },
    { label: "Create Auction", to: "/create-auction" },
    { label: "Live Auctions", to: "/browse-auction/live" },
    { label: "Upcoming Auctions", to: "/browse-auction/upcoming" },
    { label: "All Auctions", to: "/browse-auction/all" },
];

const LEGAL_LINKS = [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Contact", to: "/contact" },
];

const Footer = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            showToast.error("Please enter a valid email address");
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            showToast.success("Successfully subscribed!");
            setEmail("");
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <footer className="bg-background-primary border-t border-white/5">
            {/* Main footer */}
            <div className="container mx-auto px-6 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                    {/* Brand column */}
                    <div className="md:col-span-4">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
                            <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-all duration-200">
                                <FontAwesomeIcon icon={faGavel} className="text-primary text-sm" />
                            </div>
                            <span className="font-lora font-bold text-white text-xl tracking-wide">
                                Online Auction System
                            </span>
                        </Link>

                        <p className="text-text-secondary text-sm leading-relaxed max-w-xs mb-7">
                            Your trusted platform for buying and selling unique items through secure, transparent online auctions.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-2">
                            {SOCIAL.map((s) => (
                                <motion.a
                                    key={s.label}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.92 }}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/8 text-text-secondary hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-150"
                                >
                                    <FontAwesomeIcon icon={s.icon} className="text-sm" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="md:col-span-2 md:col-start-6">
                        <h4 className="text-xs font-semibold text-text-disabled uppercase tracking-[0.18em] mb-5">
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-text-secondary hover:text-white transition-colors duration-150"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-2">
                        <h4 className="text-xs font-semibold text-text-disabled uppercase tracking-[0.18em] mb-5">
                            Contact
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="mailto:amanshakya9912@gmail.com"
                                    className="group flex items-start gap-3 text-sm text-text-secondary hover:text-white transition-colors duration-150"
                                >
                                    <FontAwesomeIcon icon={faEnvelope} className="mt-0.5 text-primary text-xs shrink-0" />
                                    <span className="break-all">amanshakya9912@gmail.com</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+977-9818313576"
                                    className="flex items-center gap-3 text-sm text-text-secondary hover:text-white transition-colors duration-150"
                                >
                                    <FontAwesomeIcon icon={faPhone} className="text-primary text-xs shrink-0" />
                                    +977-9818313576
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="md:col-span-3 md:col-start-10">
                        <h4 className="text-xs font-semibold text-text-disabled uppercase tracking-[0.18em] mb-5">
                            Newsletter
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed mb-5">
                            Get notified about new auctions and exclusive deals.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-background-secondary text-white placeholder-text-disabled text-sm px-4 py-2.5 rounded-lg border border-white/8 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-150 hover:shadow-glow active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Subscribing…" : "Subscribe"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-disabled">
                        © {new Date().getFullYear()} Online Auction System. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {LEGAL_LINKS.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-xs text-text-disabled hover:text-text-secondary transition-colors duration-150"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;