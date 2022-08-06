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
        <div className='font-[Poppins] text-sm md:w-8/12 lg:w-11/12 mx-auto'>
            <div className='lg:flex md:flex justify-evenly text-center mt-5 lg:mt-0'>
                <div className='bg-primary p-5 rounded-md mb-5'>
                    <h1 className='text-xl text-white font-bold'>Bookings</h1>
                    <h1 className='text-4xl text-white font-bold'>{bookings.length}</h1>
                </div>
                <div className='bg-green-600 p-5 rounded-md mb-5'>
                    <h1 className='text-xl text-white font-bold'>Approved</h1>
                    <h1 className='text-4xl text-white font-bold'>{
                        bookings?.filter(booking => booking.status === 'Approved').length
                    }</h1>
                </div>
                <div className='bg-sky-600 p-5 rounded-md mb-5'>
                    <h1 className='text-2xl text-white font-bold'>Pending</h1>
                    <h1 className='text-4xl text-white font-bold'>{
                        bookings?.filter(booking => booking.status === 'Pending').length
                    }</h1>
                </div>
                <div className='bg-red-600 p-5 rounded-md mb-5'>
                    <h1 className='text-2xl text-white font-bold'>Rejected</h1>
                    <h1 className='text-4xl text-white font-bold'>{
                        bookings?.filter(booking => booking.status === 'Rejected').length
                    }</h1>
                </div>
                <div className='bg-black p-5 rounded-md mb-5'>
                    <h1 className='text-2xl text-white font-bold'>Checkout</h1>
                    <h1 className='text-4xl text-white font-bold'>{
                        bookings?.filter(booking => booking.status === 'Checkout').length
                    }</h1>
                </div>
            </div>
            <div className='mx-0 w-72 lg:w-full overflow-x-auto z-0'>
                <table className='table w-full'>
                    <thead>
                        <tr>
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
                    <tbody>
                        {
                            bookings?.map(booking => <Booking
                                booking={booking}
                                key={booking._id}
                            ></Booking>)
                        }
                    </tbody >
                </table>
            </div>
        </div>
    );
};

export default AllBookings;