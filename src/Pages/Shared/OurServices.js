import React from 'react';
import Service from './Service';
import { useQuery } from "react-query";
import Loader from './Loader';

const OurServices = () => {
    const { data: services, isLoading } = useQuery('services', () =>
        fetch('https://vacation-rental-aj.herokuapp.com/services')
            .then(res => res.json()));
    if (isLoading) {
        return <Loader />
    };
    return (
        <div className=' font-[Poppins]'>
            <h2 className='lg:text-5xl text-4xl text-gray text-center mt-12'>Why Choose Us</h2>
            <div className='lg:grid grid-cols-3 gap-5 justify-items-center lg:mx-14'>
                {
                    services?.map(service => <Service
                        key={service._id}
                        service={service}
                    >

                    </Service>)
                }
            </div>
        </div>
    );
};

export default OurServices;