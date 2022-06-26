import React from 'react';
import useRooms from '../../hooks/useRooms';
import Loader from '../Shared/Loader';
import Room from '../Shared/Room';

const Rooms = () => {
    const [rooms, isLoading] = useRooms();

    if (isLoading) {
        return <Loader />
    }
    return (
        <div className='bg-accent md:py-20 py-5 font-[Poppins]'>
            <h2 className='md:text-5xl text-4xl text-gray text-center'>Apartment Room</h2>
            <div className='md:grid grid-cols-2 gap-10 my-14 md:mx-20'>
                {
                    rooms?.slice(0, 4).map(room => <Room
                        key={room._id}
                        room={room}>
                    </Room>)
                }
            </div>
        </div>
    );
};

export default Rooms;