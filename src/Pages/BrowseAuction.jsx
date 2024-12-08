import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faStar } from "@fortawesome/free-solid-svg-icons"
import img1 from "../images/mobile1.png"
import Footer from "../Components/Footer"
import Header from "../Components/Header"

const BrowseAuction = () => {
    const [show,setShow] = useState(false)

    return (
        <>
        <Header/>
        <div className="bg-[#A27B5C] relative">
            <div className="w-full container mx-auto relative h-[200px] flex items-center justify-center">
                <h1 className="text-white text-4xl font-bold font-lora">Browse Auctions</h1>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>
        <div className='bg-black'>
        <div className="grid grid-cols-3 gap-x-5">
                        <div className="col-span-1 bg-black">
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
                        <div className="col-span-1 bg-black">
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
                        <div className="col-span-1 bg-black">
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
                    <div className="grid grid-cols-3 gap-x-5">
                        <div className="col-span-1 bg-black">
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
                        <div className="col-span-1 bg-black">
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
                        <div className="col-span-1 bg-black">
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
        </div>
        <Footer/>
        </>
    )
}
export default BrowseAuction