import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-3">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-sm text-neutral/50 font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;