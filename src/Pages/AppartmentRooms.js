import React from 'react';
import { Parallax } from 'react-parallax';
import BannerImg from '../images/about-banner.webp';
import Room from './Shared/Room';
import Loader from './Shared/Loader';
import { useQuery } from 'react-query'

const AppartmentRooms = () => {
    const { data: rooms, isLoading } = useQuery('rooms', () => fetch('http://localhost:5000/rooms')
        .then(res => res.json()))

    if (isLoading) {
        return <Loader />
    }
    return (
        <div className='font-[Poppins] min-h-screen'>
            <Parallax bgImage={BannerImg} strength={400} bgClassName='parallax-image'>
                <div className='parallex-gradient h-96 flex justify-center items-center'>
                    <div>
                        <p className='text-lg text-white text-center mt-14 md:mt-0'>Home <i className='fa-solid fa-angle-right text-xs'></i> Rooms <i className='fa-solid fa-angle-right text-xs'></i></p>
                        <h1 className='md:text-6xl text-4xl font-serif text-white font-semibold md:mt-16'>Apartment Room</h1>
                    </div>
                </div>

            </Parallax>

            <div className='md:grid grid-cols-2 gap-10 my-14 md:mx-20'>
                {
                    rooms?.map(room => <Room
                        key={room._id}
                        room={room}>
                    </Room>)
                }
            </div>

        </div>
    );
};

export default AppartmentRooms;