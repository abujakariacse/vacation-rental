import React from 'react';
import Service from './Service';

const Services = () => {
    const services = [
        {
            "_id": 1,
            "image": "https://i.ibb.co/crztH7w/service-3.jpg",
            "serviceName": "Map Direction",
            "serviceDetail": "Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic"

        },
        {
            "_id": 2,
            "image": "https://i.ibb.co/h2rrJjP/service-2.jpg",
            "serviceName": "Accomodation Services",
            "serviceDetail": "Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic."

        },
        {
            "_id": 3,
            "image": "https://i.ibb.co/5s9HYTn/service-1.jpg",
            "serviceName": "Great Experience",
            "serviceDetail": "Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic"

        }
    ]
    return (
        <div className='md:grid grid-cols-3 gap-10 justify-items-center md:mx-14'>
            {
                services?.map(service => <Service key={service._id} service={service}>

                </Service>)
            }
        </div>
    );
};

export default Services;