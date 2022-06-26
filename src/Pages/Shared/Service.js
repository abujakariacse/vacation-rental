import React from 'react';
import PrimaryButton from './PrimaryButton';

const Service = ({ service }) => {
    const { image, serviceName, serviceDetail } = service;
    return (
        <div className="card lg:w-96 w-80 mx-auto bg-base-100 shadow-xl my-7">
            <figure className="px-10 pt-10">
                <img src={image} alt="service_image" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{serviceName}</h2>
                <p>{serviceDetail}</p>
                <div className="card-actions">
                    <PrimaryButton>Read More</PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default Service;