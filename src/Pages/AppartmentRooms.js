import React from 'react';
import { Parallax } from 'react-parallax';
import RoomsBanner from '../images/about-banner.webp';
import Room from './Shared/Room';
import Loader from './Shared/Loader';
import useRooms from '../hooks/useRooms';
import { useNavigate } from 'react-router-dom';

const AppartmentRooms = () => {
    const [rooms, isLoading] = useRooms();
    const navigate = useNavigate();
    const hanldeRoomLoad = (_id) => {
        navigate(`roomDetail/${_id}`)
    }

    if (isLoading) {
        return <Loader />
    };
    return (
        <div className='font-[Poppins] min-h-screen'>
            <Parallax bgImage={RoomsBanner} strength={400} bgClassName='parallax-image'>
                <div className='parallex-gradient h-96 flex justify-center items-center'>
                    <div>
                        <p className='text-lg text-white text-center mt-14 lg:mt-0'>Home <i className='fa-solid fa-angle-right text-xs'></i> Rooms <i className='fa-solid fa-angle-right text-xs'></i></p>
                        <h1 className='lg:text-6xl text-4xl font-serif text-white font-semibold lg:mt-16'>Apartment Room</h1>
                    </div>
                </div>

            </Parallax>

            <div className='lg:grid grid-cols-2 gap-10 my-14 lg:mx-20'>
                {
                    rooms?.map(room => <Room
                        key={room._id}
                        room={room}
                        hanldeRoomLoad={hanldeRoomLoad}
                    >
                    </Room>)
                }
            </div>

        </div>
    );
};

export default AppartmentRooms;