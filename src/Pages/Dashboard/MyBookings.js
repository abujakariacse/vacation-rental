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
        <div className='font-[Poppins]'>
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
                <div className='bg-black p-5 rounded-md mb-5'>
                    <h1 className='text-2xl text-white font-bold'>Checkout</h1>
                    <h1 className='text-4xl text-white font-bold'>{
                        bookings?.filter(booking => booking.status === 'Checkout').length
                    }</h1>
                </div>
            </div>

            <div className='mx-0 w-72 lg:w-full overflow-x-auto z-0'>
                <table className='table w-full'>
                    <thead >
                        <tr>
                            <th>Room</th>
                            <th>Check In</th>
                            <th>Time</th>
                            <th>Check Out</th>
                            <th>Total Days</th>
                            <th>Quantity</th>
                            <th>Adult</th>
                            <th>Child</th>
                            <th>Per Day Cost</th>
                            <th>Total Cost</th>
                            <th>Status</th>
                            <th>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookings?.map(booking => <MyBooking
                                booking={booking}
                                key={booking._id}
                            ></MyBooking>)
                        }
                    </tbody >
                </table>
            </div>
        </div >
    );
};

export default MyBookings;