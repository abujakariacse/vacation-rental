import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Pagination, Navigation } from "swiper";

const Reviews = () => {
    const reviews = [
        {
            "image": "https://i.ibb.co/mtT5vYT/person-1.jpg",
            "name": "Mark Huff",
            "title": "Businessman",
            "comment": "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts."
        },
        {
            "image": "https://i.ibb.co/4Pq5KKm/person-2.jpg",
            "name": "Rock Henderson",
            "title": "Engineer",
            "comment": "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts."
        },
        {
            "image": "https://i.ibb.co/Wcd095d/person-3.jpg",
            "name": "Henry Dee",
            "title": "Doctor",
            "comment": "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts."
        },
        {
            "image": "https://i.ibb.co/sRZG6Zv/person-4.jpg",
            "name": "Ken Bosh",
            "title": "Teacher",
            "comment": "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts."
        },
        {
            "image": "https://i.ibb.co/4Pq5KKm/person-2.jpg",
            "name": "Rodel Golez",
            "title": "Social Activist",
            "comment": "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts."
        },
        {
            "image": "https://i.ibb.co/4Pq5KKm/person-2.jpg",
            "name": "Rodel Golez",
            "title": "Social Activist",
            "comment": "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts."
        }
    ];
    return (
        <div style={{ height: '700px' }} className='bg-accent'>
            <h1 className='text-6xl font-[poppins] text-center'>Happy Clients & Feedbacks</h1>
            <div style={{ height: '500px' }}>
                <Swiper
                    slidesPerView={3}
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
                        reviews?.map(review => <SwiperSlide>
                            <div class="card w-96 bg-base-100 shadow-2xl p-14 font-[poppins]">
                                <div className="flex justify-between">
                                    <img style={{ width: '80px', height: '80px', borderRadius: '50%' }} src={review.image} alt="" />
                                    <div class="text-left ml-5">
                                        <p className="text-slate-500 text-sm">{review.comment}</p>
                                        <div className="my-4">
                                            <h2 class="text-xl ">{review.name}</h2>
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