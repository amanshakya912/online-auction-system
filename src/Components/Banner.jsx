import { Swiper, SwiperSlide } from 'swiper/react';
import  banner1  from '../images/banner1.jpg'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useSpring, useTransition, animated } from '@react-spring/web'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel } from '@fortawesome/free-solid-svg-icons';

const Banner = () => {
    const springs = useSpring({
        from: { x: -1000 },
        to: { x: 130 },
    })
    const springs2 = useSpring({
        from: { x: -1000 },
        to: { x: 130 },
        delay: 500,
    })
    const springs3 = useSpring({
        from: { x: -1000 },
        to: { x: 130 },
        delay: 1000,
    })
    const transitions = useTransition(true, {
        delay: 1500,
        from: { opacity: 0, x: 130, y:100 },
        enter: { opacity: 1, x: 130, y:0 },
        config: { duration: 500 }
      });
      
    return (
        <>
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                // navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
            >
              
                {/* <SwiperSlide>
                    <div className='w-full bg-red-600 h-[200px]'>
                        <div>hello</div>
                    </div>
                </SwiperSlide> */}
                <SwiperSlide>
                    <div className='w-full h-auto object-cover'>
                        <img src={banner1} className='w-full relative'/>
                        <div className='z-20 absolute top-[28%] text-center text-[#A27B5C] flex flex-col text-[50px] font-[700] font-lora leading-tight'>
                            <animated.div 
                                style={{
                                    ...springs
                                }}
                            >Online</animated.div>
                            <animated.div 
                                style={{
                                    ...springs2
                                }}
                            >Auction</animated.div>
                            <animated.div 
                                style={{
                                    ...springs3
                                }}
                            >System</animated.div>
                            {transitions((style, item) =>
                                item ? (
                                    <animated.div style={style}>
                                    <div className='cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[25px] py-2 mt-5'>
                                        Bid Now <FontAwesomeIcon icon={faGavel}/>
                                    </div>
                                    </animated.div>
                                ) : null
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    )
}
export default Banner