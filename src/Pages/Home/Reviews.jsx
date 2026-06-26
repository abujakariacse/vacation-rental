import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Pagination, Navigation } from "swiper";
import { useQuery } from "react-query";
import ContentLoading from "../Shared/ContentLoading.jsx";
import { ENDPOINT } from "../../config/env";
import { useRef } from "react";

const Reviews = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { data: reviews, isLoading } = useQuery("homepageReviews", () =>
    fetch(`${ENDPOINT}/reviews?homepage=true`).then((res) => res.json()),
  );
  if (isLoading) {
    return <ContentLoading />;
  }

  return (
    <section className="bg-accent font-[Poppins] section-y">
      <div className="app-container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary tracking-wide">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral mt-2">
              Happy Clients & Feedbacks
            </h2>
            <p className="text-neutral/70 mt-3 max-w-2xl">
              Real experiences from guests who booked with VacationRental.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-neutral/60">
            <i className="fa-solid fa-arrows-left-right"></i>
            <span>Swipe or use arrows</span>
          </div>
        </div>

        <div className="mt-8 bg-base-100/40 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-4 sm:p-6">
          <div className="relative">
            {/* External nav buttons (outside carousel content) */}
            <button
              type="button"
              ref={prevRef}
              aria-label="Previous review"
              className="hidden lg:flex items-center justify-center absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-base-100/80 border border-base-200/60 shadow-md hover:bg-base-100 transition"
            >
              <i className="fa-solid fa-chevron-left text-primary"></i>
            </button>
            <button
              type="button"
              ref={nextRef}
              aria-label="Next review"
              className="hidden lg:flex items-center justify-center absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-base-100/80 border border-base-200/60 shadow-md hover:bg-base-100 transition"
            >
              <i className="fa-solid fa-chevron-right text-primary"></i>
            </button>

            <Swiper
              spaceBetween={18}
              loop={true}
              pagination={{ clickable: true }}
              modules={[Pagination, Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                // Swiper reads these during init; wire refs here.
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              breakpoints={{
                0: { slidesPerView: 1, slidesPerGroup: 1 },
                640: { slidesPerView: 2, slidesPerGroup: 2 },
                1024: { slidesPerView: 3, slidesPerGroup: 3 },
              }}
              className="mySwiper reviews-swiper"
            >
              {reviews?.map((review) => (
                <SwiperSlide key={review._id}>
                  <div className="h-full">
                    <div className="bg-base-100/80 border border-base-200/60 rounded-2xl shadow-lg p-6 sm:p-7 h-full flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-base-200 bg-base-100 shrink-0">
                            <img
                              src={review.image}
                              alt={review.name || "Client"}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral truncate">{review.name}</p>
                            <p className="text-sm text-neutral/60 truncate">{review.title}</p>
                          </div>
                        </div>
                        <div className="text-primary/70">
                          <i className="fa-solid fa-quote-right text-xl"></i>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-1 text-yellow-500 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                           <i key={i} className={`fa-solid ${i < (review.rating || 5) ? 'fa-star' : 'fa-star text-neutral/30'}`}></i>
                        ))}
                        <span className="ml-2 text-neutral/60">{review.rating ? Number(review.rating).toFixed(1) : "5.0"}</span>
                      </div>

                      <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-neutral/70 line-clamp-4 flex-1">
                        “{review.comment}”
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
