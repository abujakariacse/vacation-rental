import React from 'react';
import ApartmentRoom from './ApartmentRoom';

const ApartmentRooms = () => {
    const rooms = [
        {
            "_id": 1,
            "image": "https://i.ibb.co/g349bvb/room-1.jpg",
            "name": "Suite Room",
            "max": "2 Persons",
            "size": "45 m2",
            "view": "Sea View",
            "bed": "1"
        },
        {
            "_id": 2,
            "image": "https://i.ibb.co/SrMg9g9/room-2.jpg",
            "name": "Standard Room",
            "max": "3 Persons",
            "size": "55 m2",
            "view": "Sea View",
            "bed": "2"
        },
        {
            "_id": 3,
            "image": "https://i.ibb.co/rsr3bvy/room-3.jpg",
            "name": "Family Room",
            "max": "5 Persons",
            "size": "70 m2",
            "view": "Sea View",
            "bed": "3"
        },
        {
            "_id": 4,
            "image": "https://i.ibb.co/K2f2fsB/room-4.jpg",
            "name": "Deluxe Room",
            "max": "7 Persons",
            "size": "75 m2",
            "view": "Sea View",
            "bed": "4"
        }
    ]
    return (
        <div className='bg-accent py-20 font-[Poppins]'>
            <h2 className='md:text-5xl text-4xl text-gray text-center'>Apartment Room</h2>
            <div className='md:grid grid-cols-2 gap-10 my-14 md:mx-20'>
                {
                    rooms.map(room => <ApartmentRoom
                        key={room._id}
                        room={room}>
                    </ApartmentRoom>)
                }
            </div>
        </div>
    );
};

export default ApartmentRooms;