import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGavel, faStar } from "@fortawesome/free-solid-svg-icons"
import img1 from "../images/mobile1.png"
import { useState } from "react"
import Countdown from 'react-countdown';
const LiveAuction = () => {
    const [show,setShow] = useState(false)
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
            <div className="bg-black">
                <div className="w-full container mx-auto relative">
                    <div className="text-center font-lora text-3xl text-white py-10">
                        Live Auctions
                    </div>
                    <div className="grid grid-cols-4 text-white gap-x-5">
                        <div className="col-span-2">
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300">
                                <img src={img1}/>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className="absolute top-3 right-4">
                                        <div onClick={()=>setShow(!show)} className={`${ !show ? 'text-white' : 'text-[#A27B5C]'}`}>
                                            <FontAwesomeIcon icon={faStar} />
                                        </div>
                                    </div>
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[20px] py-2 px-5'>
                                        Bid Now <FontAwesomeIcon icon={faGavel}/>
                                    </div>
                                </div>
                                <div className="mb-4 px-5 w-1/2">
                                <Countdown date={Date.now() + 5 * 24 * 60 * 60 * 1000} renderer={renderer}/>
                                </div>
                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-xl">Samsung Galaxy</div>
                                        <div className="text-lg">Current Bid: Rs. 30,000</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-xl">No. of Bids: 10</div>
                                        <div className="text-lg">Active Bidders: 3</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col h-full gap-y-5">
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        Bid Now <FontAwesomeIcon icon={faGavel}/>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        Bid Now <FontAwesomeIcon icon={faGavel}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col h-full gap-y-5">
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        Bid Now <FontAwesomeIcon icon={faGavel}/>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        Bid Now <FontAwesomeIcon icon={faGavel}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center py-10">
                        <div className="flex items-center border-0 rounded-md px-6 py-2 bg-white text-black cursor-pointer hover:bg-[#6c3c3c] hover:text-white">Show All</div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default LiveAuction