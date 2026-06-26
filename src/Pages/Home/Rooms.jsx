import React from "react";
import { useNavigate } from "react-router-dom";
import useRooms from "../../hooks/useRooms";
import Loader from "../Shared/Loader.jsx";
import Room from "../Shared/Room.jsx";
import { slugify } from "../../utils/slugify";

const Rooms = () => {
  const [rooms, isLoading] = useRooms();
  const navigate = useNavigate();
  const hanldeRoomLoad = (room) => {
    navigate(`/roomDetail/${slugify(room.name)}`);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="bg-accent section-y font-[Poppins]">
      <div className="app-container">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary tracking-wide">Rooms</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral mt-2">
            Apartment rooms
          </h2>
          <p className="text-neutral/70 mt-3 max-w-2xl mx-auto">
            Comfortable spaces with essentials and great views—perfect for vacations or short stays.
          </p>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms?.slice(0, 6).map((room) => (
          <Room key={room._id} room={room} hanldeRoomLoad={hanldeRoomLoad}></Room>
        ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
