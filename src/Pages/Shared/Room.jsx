import React from "react";

const Room = ({ room, hanldeRoomLoad, ratingSummary }) => {
  const { _id, image, name, max, size, view, bed, rentFee } = room;
  const avg = ratingSummary?.avg || 0;
  const count = ratingSummary?.count || 0;
  return (
    <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition">
      <div className="relative">
        <img
          src={image}
          alt={name || "Room"}
          className="w-full h-56 sm:h-64 object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="badge badge-primary text-white">From ${rentFee}/night</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-neutral leading-snug">{name}</h3>
          <div className="text-sm shrink-0 flex items-center gap-1">
            <i className={`fa-solid fa-star ${avg > 0 ? "text-orange-400" : "text-base-300"}`}></i>
            <span className="text-neutral/60">{avg > 0 ? avg : "—"}</span>
            {count > 0 && <span className="text-xs text-neutral/40">({count})</span>}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-neutral/70">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-people-group text-primary"></i>
            <span>Max {max}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-ruler-combined text-primary"></i>
            <span>{size}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-mountain-sun text-primary"></i>
            <span>{view}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-bed text-primary"></i>
            <span>{bed} Queen</span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary text-white w-full mt-5"
          onClick={() => hanldeRoomLoad(room)}
        >
          View details
        </button>
      </div>
    </div>
  );
};

export default Room;
