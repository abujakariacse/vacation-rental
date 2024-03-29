import React from "react";

const Room = ({ room, hanldeRoomLoad }) => {
  const { _id, image, name, max, size, view, bed, rentFee } = room;
  return (
    <div className="room-card card lg:card-side bg-base-100 shadow-2xl mx-auto hover:bg-secondary hover:text-white transition-all duration-500 rounded-sm w-11/12 lg:w-full my-8 ">
      <figure>
        <img
          style={{ width: "400px", height: "350px" }}
          src={image}
          alt="rooms_image"
        />
      </figure>
      <div className="card-body mx-auto">
        <h4 className="price text-xl text-primary">
          ${rentFee}{" "}
          <span className="price text-gray-500 text-base">per night</span>
        </h4>
        <h2 className="text-xl font-semibold">{name}</h2>
        <h4>Max: {max}</h4>
        <h4>Size: {size}</h4>
        <h4>View: {view}</h4>
        <h4>Bed: {bed}</h4>
        <div className="card-actions justify-center mt-4">
          <button
            className="btn btn-outline rounded font-normal hover:text-black"
            onClick={() => hanldeRoomLoad(_id)}
          >
            View Room Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
