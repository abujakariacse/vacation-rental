import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Booking from './Booking';

const AllBookings = () => {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/allbookings')
            .then(res => res.json())
            .then(data => setBookings(data))
    }, [bookings])
    return (
        <div className='font-[Poppins] text-sm md:w-11/12 mx-auto'>
            <h2 className='text-3xl'>All Bookings</h2>
            <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg my-5">
                <thead className="text-white">
                    <tr className="bg-primary flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">
                        <th className="p-3 text-left">Room</th>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Phone</th>
                        <th className="p-3 text-left">Check In</th>
                        <th className="p-3 text-left">Time</th>
                        <th className="p-3 text-left">Check Out</th>
                        <th className="p-3 text-left">Days</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Adult</th>
                        <th className="p-3 text-left">Child</th>
                        <th className="p-3 text-left">Total</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Payment</th>


                    </tr>
                </thead>
                <tbody className="flex-1 sm:flex-none">
                    {
                        bookings?.map(booking => <Booking
                            booking={booking}
                            key={booking._id}
                        ></Booking>)
                    }
                </tbody >
            </table>
        </div>
    );
};

export default AllBookings;