import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const location = useLocation();
    const pathname = location.pathname;
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);

    // Function to toggle the dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };
    const toggleDropdown2 = () => {
        setIsDropdownOpen2(prevState => !prevState);
    };
    // Function to handle logout
    const logout = () => {
        // Clear the token from localStorage or sessionStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username'); // Optionally clear user data
        localStorage.removeItem('id');
        // Redirect to the login page or home page
        window.location.href = '/sign-up';
    };
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={`${pathname === '/' ? 'absolute top-10 z-50 w-full' : 'bg-black py-5'}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="text-white text-lg font-bold">OAS</div>

                    {/* Hamburger Menu */}
                    <button
                        className="text-white md:hidden"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>

                    {/* Navigation Links */}
                    <nav
                        className={`${menuOpen ? "block" : "hidden"
                            } md:flex gap-x-8 items-center text-white cursor-pointer absolute md:relative top-16 left-0 w-full md:w-auto bg-black md:bg-transparent md:top-0`}
                    >
                        <ul className="flex flex-col md:flex-row items-center md:gap-x-8 gap-y-5 p-4 md:p-0">
                            <Link to={'/'}>
                                <li
                                    className={`${pathname === '/' ? 'text-[#6c3c3c] font-bold' : 'hover:text-[#6c3c3c]'
                                        }`}
                                >
                                    Home
                                </li>
                            </Link>
                            <div className="relative">
                                {/* Browse Auctions Menu */}
                                <li
                                    className="text-white cursor-pointer"
                                    onClick={toggleDropdown2} // Function to toggle dropdown visibility
                                >
                                    Browse Auctions
                                </li>

                                {/* Dropdown Menu */}
                                {isDropdownOpen2 && (
                                    <ul
                                        className="absolute right-0 mt-2 w-40 bg-[#A27B5C] text-white rounded-md shadow-lg overflow-hidden z-10"
                                    >
                                        <Link to="/browse-auction/live">
                                            <li className="px-4 py-2 hover:bg-[#8D6547] cursor-pointer">
                                                Live Auctions
                                            </li>
                                        </Link>
                                        <Link to="/browse-auction/upcoming">
                                            <li className="px-4 py-2 hover:bg-[#8D6547] cursor-pointer">
                                                Upcoming Auctions
                                            </li>
                                        </Link>
                                        <Link to="/browse-auction/recent">
                                            <li className="px-4 py-2 hover:bg-[#8D6547] cursor-pointer">
                                                Recent Auctions
                                            </li>
                                        </Link>
                                    </ul>
                                )}
                            </div>
                            <Link to={'/create-auction'}>
                                <li
                                    className={`${pathname === '/create-auction' ? 'text-[#6c3c3c] font-bold' : 'hover:text-[#6c3c3c]'
                                        }`}
                                >
                                    Create Auction
                                </li>
                            </Link>
                            {/* <li
                                className={`${pathname === '/category' ? 'text-[#6c3c3c] font-bold' : 'hover:text-[#6c3c3c]'
                                    }`}
                            >
                                Category
                            </li> */}
                            {/* <Link to={'/contact'}>
                                <li
                                    className={`${pathname === '/contact' ? 'text-[#6c3c3c] font-bold' : 'hover:text-[#6c3c3c]'
                                        }`}
                                >
                                    Contact
                                </li>
                            </Link> */}
                            {!token ? (
                                <Link to={'/sign-up'}>
                                    <li className="flex items-center border-0 rounded-md px-6 py-1 bg-white text-[#6c3c3c] cursor-pointer hover:bg-[#6c3c3c] hover:text-white">
                                        Sign Up
                                    </li>
                                </Link>
                            ) : (
                                <div className="relative">
                                    {/* User profile menu */}
                                    <li
                                        className="text-white cursor-pointer"
                                        onClick={toggleDropdown}
                                    >
                                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                                        {username}
                                    </li>

                                    {/* Dropdown menu */}
                                    {isDropdownOpen && (
                                        <ul
                                            className="absolute right-0 mt-2 w-40 bg-[#A27B5C] text-white rounded-md shadow-lg overflow-hidden z-10"
                                        >
                                            <Link to={`/user/${username}`}>
                                                <li
                                                    className="px-4 py-2 hover:bg-[#8D6547] cursor-pointer"
                                                >
                                                    Profile
                                                </li>
                                            </Link>
                                            <li
                                                className="px-4 py-2 hover:bg-[#8D6547] cursor-pointer"
                                                onClick={logout}
                                            >
                                                Logout
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
