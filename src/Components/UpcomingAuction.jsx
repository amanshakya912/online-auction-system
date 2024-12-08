import img1 from "../images/mobile1.png"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faStar } from "@fortawesome/free-solid-svg-icons"
const UpcomingAuction = () => {
    const [show,setShow] = useState(false)

    return (
        <>
            <div className="bg-[#A27B5C] relative">
                <div className="w-full container mx-auto relative z-20">
                    <div className="text-center font-lora text-3xl text-white pt-20 pb-10">
                        Upcoming Auctions
                    </div>
                    <div className="grid grid-cols-2 gap-x-5">
                        <div className="col-span-1">
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300">
                                <img src={img1}/>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className="absolute top-3 right-4">
                                        <div onClick={()=>setShow(!show)} className={`${ !show ? 'text-white' : 'text-[#A27B5C]'}`}>
                                            <FontAwesomeIcon icon={faStar} />
                                        </div>
                                    </div>
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[20px] py-2 px-5'>
                                        Set Reminder <FontAwesomeIcon icon={faBell}/>
                                    </div>
                                </div>
                                <div className="mb-4 px-5 w-1/3">
                                    <div className="bg-[#212121] text-white p-2 text-start">
                                        2024-04-12 08:00 PM
                                    </div>
                                </div>
                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-xl">Samsung Galaxy</div>
                                        <div className="text-lg">Starting Bid: Rs. 30,000</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-xl">Waiting: 10</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300">
                                <img src={img1}/>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className="absolute top-3 right-4">
                                        <div onClick={()=>setShow(!show)} className={`${ !show ? 'text-white' : 'text-[#A27B5C]'}`}>
                                            <FontAwesomeIcon icon={faStar} />
                                        </div>
                                    </div>
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[20px] py-2 px-5'>
                                        Set Reminder <FontAwesomeIcon icon={faBell}/>
                                    </div>
                                </div>
                                <div className="mb-4 px-5 w-1/3">
                                    <div className="bg-[#212121] text-white p-2 text-start">
                                        2024-04-12 08:00 PM
                                    </div>
                                </div>
                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-xl">Samsung Galaxy</div>
                                        <div className="text-lg">Starting Bid: Rs. 30,000</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-xl">Waiting: 10</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center pt-10 pb-20">
                        <div className="flex items-center border-0 rounded-md px-6 py-2 bg-white text-black cursor-pointer hover:bg-[#6c3c3c] hover:text-white">Show All</div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
            </div>
        </>
    )
}
export default UpcomingAuction