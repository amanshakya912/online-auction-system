import { Link, useLocation } from "react-router-dom"

const Header = () => {
    const location = useLocation()
    const pathname = location.pathname
    return (
        <>
            <div className={`${ pathname == '/' ? 'absolute top-10 z-10 w-full' : 'bg-black py-5' }`}>
                <div className="w-full container mx-auto relative">
                    <div className="flex justify-between">
                        <div className="text-white">
                            Logo
                        </div>
                        <ul className="flex gap-x-8 items-center text-white cursor-pointer">
                            <Link to={'/'}>
                                <li className={`${pathname == '/' ? 'text-[#6c3c3c] font-bold' : 'hover:text-[#6c3c3c]'}`}>Home</li>
                            </Link>
                            <Link to={'/browse-auction'}>
                            <li className={`${pathname == '/browse-auction' ? 'text-[#6c3c3c] font-bold' : 'hover:text-[#6c3c3c]'}`}>Browse Auctions</li>
                            </Link>
                            <Link to={'/create-auction'}>
                                <li className={`${pathname == '/create-auction' ? 'text-[#6c3c3c] font-bold' : 'hover:text-[#6c3c3c]'}`}>Create Auction</li>
                            </Link>
                            <li className={`${pathname == '/category' ? 'text-[#6c3c3c] font-bold' : 'hover:text-[#6c3c3c]'}`}>Category</li>
                            <Link to={'/contact'}>
                            <li className={`${pathname == '/contact' ? 'text-[#6c3c3c] font-bold' : 'hover:text-[#6c3c3c]'}`}>Contact</li>
                            </Link>
                            <Link to={'/sign-up'}>
                            <li className="flex items-center border-0 rounded-md px-6 py-1 bg-white text-[#6c3c3c] cursor-pointer hover:bg-[#6c3c3c] hover:text-white">Sign Up</li>
                            </Link>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Header