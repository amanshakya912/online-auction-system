import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faSearch, faArrowUp, faBars, faTimes,
    faGavel, faChevronDown, faSignOutAlt, faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import EmailVerificationBanner from "./EmailVerificationBanner";

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Sell", to: "/create-auction" },
];

const BROWSE_ITEMS = [
    { label: "Live Auctions", to: "/browse-auction/live", dot: "bg-status-live" },
    { label: "Upcoming", to: "/browse-auction/upcoming", dot: "bg-status-upcoming" },
    { label: "Recent", to: "/browse-auction/recent", dot: "bg-text-disabled" },
    { label: "All Auctions", to: "/browse-auction/all", dot: null },
];

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const [menuOpen, setMenuOpen] = useState(false);
    const [browseOpen, setBrowseOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const searchRef = useRef(null);
    const browseRef = useRef(null);
    const userRef = useRef(null);

    const showBanner =
        isAuthenticated &&
        !bannerDismissed &&
        localStorage.getItem("emailVerified") !== "true";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        setBrowseOpen(false);
        setUserOpen(false);
        setSearchOpen(false);
    }, [pathname]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (browseRef.current && !browseRef.current.contains(e.target)) setBrowseOpen(false);
            if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/browse-auction/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
            setSearchOpen(false);
        }
    };

    const isHome = pathname === "/";
    const headerBg = isHome && !isScrolled
        ? "bg-transparent"
        : "bg-background-primary/95 backdrop-blur-md border-b border-white/5";

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-sticky transition-all duration-300 ${headerBg}`}
                animate={{ height: isScrolled ? 60 : 72 }}
                transition={{ duration: 0.2 }}
            >
                {showBanner && (
                    <EmailVerificationBanner onDismiss={() => setBannerDismissed(true)} />
                )}

                <div className="container mx-auto px-6 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-all duration-200">
                            <FontAwesomeIcon icon={faGavel} className="text-primary text-sm" />
                        </div>
                        <span className="font-lora font-bold text-white text-lg tracking-wide group-hover:text-primary/90 transition-colors duration-200">
                            OAS
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                pathname === "/"
                                    ? "text-primary bg-primary/10"
                                    : "text-text-secondary hover:text-white hover:bg-white/5"
                            }`}
                        >
                            Home
                        </Link>

                        {/* Browse Dropdown */}
                        <div className="relative" ref={browseRef}>
                            <button
                                onClick={() => setBrowseOpen(!browseOpen)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                    pathname.startsWith("/browse")
                                        ? "text-primary bg-primary/10"
                                        : "text-text-secondary hover:text-white hover:bg-white/5"
                                }`}
                            >
                                Browse
                                <motion.span
                                    animate={{ rotate: browseOpen ? 180 : 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {browseOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-2 w-52 bg-background-elevated border border-white/8 rounded-xl shadow-modal overflow-hidden"
                                    >
                                        {BROWSE_ITEMS.map((item) => (
                                            <Link key={item.to} to={item.to}>
                                                <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-100">
                                                    {item.dot && (
                                                        <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shrink-0`} />
                                                    )}
                                                    {!item.dot && <span className="w-1.5 h-1.5 shrink-0" />}
                                                    <span className="text-sm text-text-primary">{item.label}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            to="/create-auction"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                pathname === "/create-auction"
                                    ? "text-primary bg-primary/10"
                                    : "text-text-secondary hover:text-white hover:bg-white/5"
                            }`}
                        >
                            Sell
                        </Link>
                    </nav>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Search */}
                        <AnimatePresence mode="wait">
                            {searchOpen ? (
                                <motion.form
                                    key="search-open"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 240, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    onSubmit={handleSearch}
                                    className="flex items-center relative overflow-hidden"
                                >
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder="Search auctions..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                                        className="w-full bg-white/8 text-white placeholder-text-disabled text-sm px-4 py-2 pr-10 rounded-lg border border-white/10 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                                    />
                                    <button type="submit" className="absolute right-3 text-text-disabled hover:text-primary transition-colors">
                                        <FontAwesomeIcon icon={faSearch} className="text-xs" />
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.button
                                    key="search-icon"
                                    onClick={() => setSearchOpen(true)}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-150"
                                >
                                    <FontAwesomeIcon icon={faSearch} className="text-sm" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {!isAuthenticated ? (
                            <Link to="/sign-up">
                                <button className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-150 hover:shadow-glow active:scale-95">
                                    Sign In
                                </button>
                            </Link>
                        ) : (
                            <div className="relative" ref={userRef}>
                                <button
                                    onClick={() => setUserOpen(!userOpen)}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-150 group"
                                >
                                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUser} className="text-primary text-xs" />
                                    </div>
                                    <span className="text-sm text-text-primary max-w-[90px] truncate">{user.username}</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="text-xs text-text-disabled group-hover:text-text-secondary transition-colors" />
                                </button>

                                <AnimatePresence>
                                    {userOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-52 bg-background-elevated border border-white/8 rounded-xl shadow-modal overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-white/5">
                                                <p className="text-xs text-text-disabled uppercase tracking-wider">Signed in as</p>
                                                <p className="text-sm text-white font-medium truncate mt-0.5">{user.username}</p>
                                            </div>
                                            <Link to={`/user/${user.username}`}>
                                                <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                                    <FontAwesomeIcon icon={faUser} className="text-xs text-text-disabled w-4" />
                                                    <span className="text-sm text-text-primary">Profile</span>
                                                </div>
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin/dashboard">
                                                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                                        <FontAwesomeIcon icon={faTachometerAlt} className="text-xs text-text-disabled w-4" />
                                                        <span className="text-sm text-text-primary">Dashboard</span>
                                                    </div>
                                                </Link>
                                            )}
                                            <div className="border-t border-white/5">
                                                <button
                                                    onClick={logout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-semantic-error/10 transition-colors group"
                                                >
                                                    <FontAwesomeIcon icon={faSignOutAlt} className="text-xs text-text-disabled group-hover:text-semantic-error w-4 transition-colors" />
                                                    <span className="text-sm text-text-primary group-hover:text-semantic-error transition-colors">Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white hover:bg-white/5 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
                    </button>
                </div>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {menuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMenuOpen(false)}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-modal-backdrop md:hidden"
                            />
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "tween", duration: 0.25 }}
                                className="fixed right-0 top-0 h-full w-72 bg-background-elevated border-l border-white/5 z-modal md:hidden flex flex-col"
                            >
                                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                                    <span className="font-lora font-bold text-white text-lg">Menu</span>
                                    <button
                                        onClick={() => setMenuOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="text-sm" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                                    {/* Mobile search */}
                                    <form onSubmit={handleSearch} className="relative mb-4">
                                        <input
                                            type="text"
                                            placeholder="Search auctions..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-background-secondary text-white placeholder-text-disabled text-sm px-4 py-2.5 pr-10 rounded-lg border border-white/8 focus:outline-none focus:border-primary/50"
                                        />
                                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled">
                                            <FontAwesomeIcon icon={faSearch} className="text-xs" />
                                        </button>
                                    </form>

                                    <Link to="/" onClick={() => setMenuOpen(false)}>
                                        <div className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/" ? "bg-primary/15 text-primary" : "text-text-primary hover:bg-white/5"}`}>
                                            Home
                                        </div>
                                    </Link>

                                    {/* Browse section */}
                                    <div>
                                        <button
                                            onClick={() => setBrowseOpen(!browseOpen)}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-text-primary hover:bg-white/5 transition-colors"
                                        >
                                            Browse Auctions
                                            <motion.span animate={{ rotate: browseOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
                                                <FontAwesomeIcon icon={faChevronDown} className="text-xs text-text-disabled" />
                                            </motion.span>
                                        </button>
                                        <AnimatePresence>
                                            {browseOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden ml-3 mt-1 space-y-0.5"
                                                >
                                                    {BROWSE_ITEMS.map((item) => (
                                                        <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                                                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                                                                {item.dot && <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shrink-0`} />}
                                                                {!item.dot && <span className="w-1.5 h-1.5 shrink-0" />}
                                                                {item.label}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <Link to="/create-auction" onClick={() => setMenuOpen(false)}>
                                        <div className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/create-auction" ? "bg-primary/15 text-primary" : "text-text-primary hover:bg-white/5"}`}>
                                            Sell
                                        </div>
                                    </Link>
                                </div>

                                {/* Mobile auth */}
                                <div className="px-4 py-4 border-t border-white/5">
                                    {!isAuthenticated ? (
                                        <Link to="/sign-up" onClick={() => setMenuOpen(false)}>
                                            <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors">
                                                Sign In / Join
                                            </button>
                                        </Link>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="px-4 py-2 mb-2">
                                                <p className="text-xs text-text-disabled">Signed in as</p>
                                                <p className="text-sm text-white font-medium truncate">{user.username}</p>
                                            </div>
                                            <Link to={`/user/${user.username}`} onClick={() => setMenuOpen(false)}>
                                                <div className="px-4 py-3 rounded-lg text-sm text-text-primary hover:bg-white/5 transition-colors">Profile</div>
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                                                    <div className="px-4 py-3 rounded-lg text-sm text-text-primary hover:bg-white/5 transition-colors">Dashboard</div>
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => { logout(); setMenuOpen(false); }}
                                                className="w-full text-left px-4 py-3 rounded-lg text-sm text-semantic-error hover:bg-semantic-error/10 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Back to Top */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="fixed bottom-8 right-8 z-fixed w-10 h-10 bg-primary hover:bg-primary-dark text-white rounded-full shadow-raised hover:shadow-glow flex items-center justify-center transition-all duration-200 active:scale-95"
                        aria-label="Back to top"
                    >
                        <FontAwesomeIcon icon={faArrowUp} className="text-sm" />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;