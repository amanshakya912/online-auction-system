import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
const Banner = () => {
    return (
        <>
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
            >
                <SwiperSlide>
                    <div className='w-full bg-blue-600 h-[200px]'>
                        <div>hello</div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='w-full bg-red-600 h-[200px]'>
                        <div>hello</div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    )
}
export default Banner