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
                <div className='bg-yellow-500 p-5 rounded-md mb-5'>
                    <h1 className='text-2xl text-white font-bold'>Checkout</h1>
                    <h1 className='text-4xl text-white font-bold'>{
                        bookings?.filter(booking => booking.status === 'Checkout').length
                    }</h1>
                </div>
            </div>
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