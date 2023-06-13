import React from "react";

const AddReview = () => {
  return (
    <div>
      <h2 className="text-3xl">Add Review</h2>
      <div className="card w-96 bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <input
            type="text"
            placeholder="Enter your name"
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Enter your professtion"
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default AddReview;
