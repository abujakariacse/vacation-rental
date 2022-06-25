import React from 'react';

const ApartmentRoom = ({ room }) => {
    const { image, name, max, size, view, bed } = room;
    return (
        <div className="room-card card lg:card-side bg-base-100 shadow-2xl mx-auto hover:bg-secondary transition-all duration-500 rounded-sm w-11/12 md:w-full my-8 ">
            <figure><img style={{ width: '400px', height: '350px' }} src={image} alt="rooms_image" /></figure>
            <div className="card-body mx-auto">
                <h2 className="text-xl font-semibold">{name}</h2>
                <h4>Max: {max}</h4>
                <h4>Size: {size}</h4>
                <h4>View: {view}</h4>
                <h4>Bed: {bed}</h4>
                <div className="card-actions justify-center mt-4">
                    <button className="btn btn-outline rounded font-normal hover:text-black">View Room Details</button>
                </div>
            </div>

        </div>
    );
};

export default ApartmentRoom;