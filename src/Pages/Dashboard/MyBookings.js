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
        <div>
            <h2 className='text-3xl'>My Bookings</h2>
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