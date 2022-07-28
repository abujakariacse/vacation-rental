import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import ContentLoading from '../Shared/ContentLoading';
import MyBooking from './MyBooking';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [user, loading] = useAuthState(auth);
    const email = user?.email;
    useEffect(() => {
        if (email) {
            fetch(`http://localhost:5000/mybookings?email=${email}`)
                .then(res => res.json())
                .then(data => setBookings(data))
        }
    }, [email, bookings])
    if (loading) {
        return <ContentLoading />
    }
    return (
        <div className='font-[Poppins] md:w-11/12 mx-auto'>
            <h2 className='text-3xl text-center my-5 font-bold'>My Bookings</h2>
            <div className='lg:flex md:flex justify-evenly text-center'>
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
                        <th className="p-3 text-left">Check In</th>
                        <th className="p-3 text-left">Time</th>
                        <th className="p-3 text-left">Check Out</th>
                        <th className="p-3 text-left">Total Days</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Adult</th>
                        <th className="p-3 text-left">Child</th>
                        <th className="p-3 text-left">Per Day Cost</th>
                        <th className="p-3 text-left">Total Cost</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Action</th>

                    </tr>
                </thead>
                <tbody className="flex-1 sm:flex-none">
                    {
                        bookings?.map(booking => <MyBooking
                            booking={booking}
                            key={booking._id}
                        ></MyBooking>)
                    }
                </tbody >
            </table>
        </div >
    );
};

export default MyBookings;