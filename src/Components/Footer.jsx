import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <>
            <div className="bg-black">
                <div className="w-full relative text-white pt-10 border-0 border-t border-white">
                    <div className="mx-auto">
                        <div className="grid md:grid-cols-3 grid-cols-1 gap-8" >
                            <div className="col-span-1 flex items-center justify-center">
                                <div className="font-lora font-bold text-3xl">Online Auction System</div>
                            </div>
                            <div className="col-span-1 flex flex-col text-lg items-center">
                                <div className="font-lora font-medium text-xl">Important Links</div>
                                <Link to="/create-auction"><div className="cursor-pointer hover:text-amber-900">Create Auction</div></Link>
                                <Link to="/browse-auction/live"><div className="cursor-pointer hover:text-amber-900">Live Auctions</div></Link>
                                <Link to="/browse-auction/upcoming"><div className="cursor-pointer hover:text-amber-900">Upcoming Auctions</div></Link>
                                <Link to="/browse-auction/recent"><div className="cursor-pointer hover:text-amber-900">Recent Auctions</div></Link>
                            </div>
                            <div className="col-span-1 flex flex-col text-lg items-center">
                                <div className="font-lora font-medium text-xl">Contact</div>
                                <div><FontAwesomeIcon icon={faEnvelope} className="mr-2"/><a className="cursor-pointer hover:text-amber-900" mailto="amanshakya9912@gmail.com">amanshakya9912@gmail.com</a></div>                     
                                <div><FontAwesomeIcon icon={faPhone} className="mr-2"/><a className="cursor-pointer hover:text-amber-900" href="tel:+977-9818313576">+977-9818313576</a></div>                     
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-0 border-t border-white w-full mt-10"></div>
                <div className="text-center py-2 text-white">© Copyright</div>
            </div>
        </>
    )
}
export default Footer