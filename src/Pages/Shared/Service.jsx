import React from "react";

const Service = ({ service }) => {
  const { image, serviceName, serviceDetail } = service;
  return (
    <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 hover:shadow-2xl transition">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-base-100/70 border border-base-200/60 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
          {image ? (
            <img src={image} alt={serviceName || "Service"} className="w-10 h-10 object-contain" />
          ) : (
            <i className="fa-solid fa-star text-primary text-xl"></i>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-neutral">{serviceName}</h3>
          <p className="text-sm text-neutral/70 mt-1 leading-relaxed">{serviceDetail}</p>
        </div>
      </div>
    </div>
  );
};

export default Service;