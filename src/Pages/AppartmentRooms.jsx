import React, { useEffect, useState } from "react";
import { Parallax } from "react-parallax";
import RoomsBanner from "../images/about-banner.webp";
import Room from "./Shared/Room.jsx";
import useRooms from "../hooks/useRooms";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Shared/Loader.jsx";
import { slugify } from "../utils/slugify";
import { ENDPOINT } from "../config/env";

const AppartmentRooms = () => {
  const [rooms, isLoading] = useRooms();
  const navigate = useNavigate();
  const [ratingSummaries, setRatingSummaries] = useState({});

  useEffect(() => {
    fetch(`${ENDPOINT}/room-rating-summaries`)
      .then((r) => r.json())
      .then((d) => setRatingSummaries(d || {}))
      .catch(() => {});
  }, []);

  const hanldeRoomLoad = (room) => {
    navigate(`/roomDetail/${slugify(room.name)}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="font-[Poppins] min-h-screen bg-accent">
      <Parallax bgImage={RoomsBanner} strength={400} bgClassName="parallax-image">
        <div className="parallex-gradient h-96 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <p className="text-lg text-white/90">
              Home <i className="fa-solid fa-angle-right text-xs"></i> Rooms{" "}
              <i className="fa-solid fa-angle-right text-xs"></i>
            </p>
            <h1 className="lg:text-6xl text-4xl font-serif text-white font-semibold mt-6">
              Browse rooms
            </h1>
            <p className="text-white/80 mt-4 max-w-2xl">
              Pick a space that fits your trip—comfortable beds, great views, and amenities that
              make your stay effortless.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="btn btn-secondary text-white">
                Contact us
              </Link>
              <Link to="/dashboard" className="btn btn-outline text-white border-white/60">
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      </Parallax>

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary tracking-wide">Available rooms</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">
                Find your perfect stay
              </h2>
            </div>
            <p className="text-sm text-neutral/60">{rooms?.length || 0} rooms</p>
          </div>

          {rooms?.length ? (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Room key={room._id} room={room} hanldeRoomLoad={hanldeRoomLoad} ratingSummary={ratingSummaries[room._id]} />
              ))}
            </div>
          ) : (
            <div className="mt-10 bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-10 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <i className="fa-solid fa-bed text-3xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral mt-6">No rooms found</h3>
              <p className="text-neutral/70 mt-2">
                Please try again later or contact us for availability.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link to="/contact" className="btn btn-primary text-white">
                  Contact
                </Link>
                <Link to="/" className="btn btn-outline">
                  Back home
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AppartmentRooms;