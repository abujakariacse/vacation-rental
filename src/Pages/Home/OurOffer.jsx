import React from "react";
import OfferImg from "../../images/offer.webp";
import Amenities from "../Shared/Amenities.jsx";

const OurOffer = () => {
  const styles = {
    display: "grid",
    gridCols: "grid-cols-1 sm:grid-cols-2",
    marginY: "mt-6",
  };

  return (
    <section className="bg-accent section-y font-[Poppins]">
      <div className="app-container">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-base-200/60 shadow-xl bg-base-100/40 backdrop-blur-xl">
              <img
                className="w-full h-[260px] sm:h-[360px] lg:h-[420px] object-cover"
                src={OfferImg}
                alt="What we offer"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="text-sm font-semibold text-primary tracking-wide">What we offer</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral mt-2">
              Everything you need for a comfortable stay
            </h2>
            <p className="text-neutral/70 mt-3 leading-relaxed">
              From reliable Wi‑Fi to daily essentials, our apartments are designed to feel simple,
              clean, and welcoming—so you can focus on your trip.
            </p>

            <Amenities styles={styles} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurOffer;