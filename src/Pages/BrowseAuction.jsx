import Footer from "../Components/Footer"
import Header from "../Components/Header"
import img1 from "../images/mobile1.png"

const BrowseAuction = () => {
    return (
        <>
        <Header />
        <div className="bg-black">
                <div className="w-full container mx-auto relative">
                    <div className="text-center font-lora text-3xl text-white py-10">
                        Recent Auctions
                    </div>
                </div>                    
        </div>
        <Footer/>
        </>
    )
}
export default BrowseAuction