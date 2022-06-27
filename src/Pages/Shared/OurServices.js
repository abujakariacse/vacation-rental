import React from 'react';
import Service from './Service';
import { useQuery } from "react-query";
import Loader from './Loader';

const OurServices = () => {
    const { data: services, isLoading } = useQuery('services', () =>
        fetch('http://localhost:5000/services')
            .then(res => res.json()));
    if (isLoading) {
        return <Loader />
    };
    return (
        <div className='lg:grid grid-cols-3 gap-10 justify-items-center lg:mx-14'>
            {
                services?.map(service => <Service
                    key={service._id}
                    service={service}
                >

                </Service>)
            }
        </div>
    );
};

export default OurServices;