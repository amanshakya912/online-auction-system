import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import img1 from "../images/mobile1.png"

const RecentAuction = () => {
    return (
        <>
            <div className="bg-black">
                <div className="w-full container mx-auto relative">
                    <div className="text-center font-lora text-3xl text-white py-10">
                        Recent Auctions
                    </div>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={4}
                        pagination={{ clickable: true }}
                        onSwiper={(swiper) => console.log(swiper)}
                        autoplay={true}
                        scrollbar={{ draggable: true }}
                        >
                        <SwiperSlide>
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <img src={img1}/>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        View Details
                                    </div>
                                </div>
                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-base">Samsung Galaxy</div>
                                        <div className="text-sm">Sold At: Rs. 30,000</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-base">No. of Bids: 10</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <img src={img1}/>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        View Details
                                    </div>
                                </div>
                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-base">Samsung Galaxy</div>
                                        <div className="text-sm">Sold At: Rs. 30,000</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-base">No. of Bids: 10</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <img src={img1}/>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        View Details
                                    </div>
                                </div>
                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-base">Samsung Galaxy</div>
                                        <div className="text-sm">Sold At: Rs. 30,000</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-base">No. of Bids: 10</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <img src={img1}/>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        View Details
                                    </div>
                                </div>
                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-base">Samsung Galaxy</div>
                                        <div className="text-sm">Sold At: Rs. 30,000</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-base">No. of Bids: 10</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <img src={img1}/>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        View Details
                                    </div>
                                </div>
                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-base">Samsung Galaxy</div>
                                        <div className="text-sm">Sold At: Rs. 30,000</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-base">No. of Bids: 10</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                                <img src={img1}/>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5'>
                                        View Details
                                    </div>
                                </div>
                                <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="text-base">Samsung Galaxy</div>
                                        <div className="text-sm">Sold At: Rs. 30,000</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-base">No. of Bids: 10</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                    <div className="flex justify-center items-center py-10">
                        <div className="flex items-center border-0 rounded-md px-6 py-2 bg-white text-black cursor-pointer hover:bg-[#6c3c3c] hover:text-white">Show All</div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default RecentAuction