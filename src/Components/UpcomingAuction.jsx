import img1 from "../images/mobile1.png"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faStar } from "@fortawesome/free-solid-svg-icons"
import Api from "../utils/Api"
import Helper from "../utils/Helper"
import { Link } from "react-router-dom"
import Countdown from "react-countdown"
import Loader from "./Loader"
const UpcomingAuction = () => {
    const [show,setShow] = useState(false)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false);
    console.log('p',products)
    const formatDate = (d) => {
        const date = new Date(d);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        const result = `${formattedDate} ${formattedTime}`;
        return result
    }
    useEffect(()=>{
        const productData = async () => {
            try {
                setLoading(true)
                const res = await Api.getProducts();
                // console.log('data',res)
                const currentTime = new Date();
                const upcomingProducts = res.filter(product => {
                    const startTime = new Date(product.auctionStartTime)
                    return currentTime < startTime
                })
                // console.log('u',upcomingProducts)
                setProducts(upcomingProducts)
                setLoading(false)
            } catch (e){
                console.log('err',e)
            }
        }
        productData()
    },[])
    const renderer = ({ days, hours, minutes, seconds }) => {
        return (
            <div className="grid grid-cols-4 bg-[#212121] text-white p-2 text-center">
                <div className="col-span-1 border-0 border-r">
                    {days}D
                </div>
                <div className="col-span-1 border-0 border-r">
                    {hours}H
                </div>
                <div className="col-span-1 border-0 border-r">
                    {minutes}M
                </div>
                <div className="col-span-1">
                    {seconds}S
                </div>
            </div>
        );
    };
    return (
        <>
            <div className="bg-[#A27B5C] relative">
                <div className="w-full container mx-auto relative z-20">
                    <div className="text-center font-lora md:text-3xl text-2xl text-white pt-20 pb-10">
                        Upcoming Auctions
                    </div>
                    {loading ? <>
                    <Loader/>
                    </> :<>
                        {products.length > 0 ? (
                        <>
                            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mx-5 md:mx-0">
                                {products.slice(0, 2).map(product => (
                                    <>
                                        <div className="col-span-1">
                                            <Link to={`/${product.slug}`}>
                                                <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300">
                                                    <img src={`${Helper.BASE_URL}${product.images}`}/>
                                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                                        {/* <div className="absolute top-3 right-4">
                                                            <div onClick={()=>setShow(!show)} className={`${ !show ? 'text-white' : 'text-[#A27B5C]'}`}>
                                                                <FontAwesomeIcon icon={faStar} />
                                                            </div>
                                                        </div> */}
                                                        <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[20px] py-2 px-5'>
                                                            View Details
                                                        </div>
                                                    </div>
                                                    <div className="mb-4 px-5 md:w-1/2 w-full">
                                                        <div className="bg-[#212121] text-white p-2 text-start">
                                                            {/* 2024-04-12 08:00 PM */}
                                                            <Countdown date={new Date(product.auctionStartTime)} renderer={renderer} />
                                                            {/* {formatDate(product.auctionStartTime)} */}
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                                        <div className="flex flex-col">
                                                            <div className="text-xl">{product.name}</div>
                                                            <div className="text-lg">Starting Price: {product.startingPrice}</div>
                                                        </div>
                                                        {/* <div className="flex flex-col">
                                                            <div className="text-xl">Waiting: 10</div>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                    <div className="text-black text-center py-10">
                        No Upcoming auctions available.
                    </div>
                    </>
                    )}</>}
                    
                    <div className="flex justify-center items-center pt-10 pb-20">
                    <Link to="/browse-auction/upcoming">
                        <div className="flex items-center border-0 rounded-md px-6 py-2 bg-white text-black cursor-pointer hover:bg-[#6c3c3c] hover:text-white">Show All</div>
                    </Link>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
            </div>
        </>
    )
}
export default UpcomingAuction