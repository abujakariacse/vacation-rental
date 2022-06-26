import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Pagination, Navigation } from "swiper";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import Loader from "../Shared/Loader";

const Reviews = () => {
    const [windowSize, setWindowSize] = useState(window.innerWidth);
    useEffect(() => {
        window.addEventListener('resize', () => setWindowSize(window.innerWidth))

        return window.removeEventListener('resize', () => setWindowSize(window.innerWidth));
    }, []);

    const { data: reviews, isLoading } = useQuery('reviews', () =>
        fetch('http://localhost:5000/reviews')
            .then(res => res.json()));
    if (isLoading) {
        return <Loader />
    }

    return (
        <div className='bg-accent lg:py-16 font-[Poppins]'>
            <h1 className='lg:text-6xl text-xl text-center'>Happy Clients & Feedbacks</h1>
            <div style={{ height: '500px' }}>
                <Swiper
                    slidesPerView={windowSize > 640 ? 3 : 1}
                    spaceBetween={30}
                    loop={true}
                    loopFillGroupWithBlank={true}
                    slidesPerGroup={3}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                >
                    {
                        reviews?.map(review => <SwiperSlide key={review._id}>
                            <div className="card lg:w-96 w-11/12 bg-base-100 shadow-2xl p-14 relative">
                                <div className="absolute top-0 left-44">
                                    <i className="fa-solid fa-quote-right text-2xl text-primary"></i>
                                </div>
                                <div className="flex justify-between">
                                    <img style={{ width: '80px', height: '80px', borderRadius: '50%' }} src={review.image} alt="" />
                                    <div className="text-left ml-5">
                                        <p className="text-slate-500 text-sm">{review.comment}</p>
                                        <div className="my-4">
                                            <h2 className="text-xl ">{review.name}</h2>
                                            <h3 className="text-base text-slate-500">{review.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>)
                    }
                </Swiper>
            </div>

        </div>
    );
};

export default Reviews;