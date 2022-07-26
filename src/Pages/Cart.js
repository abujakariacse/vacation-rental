
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import auth from '../firebase.init';

const Cart = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [targetRoom, setTargetRoom] = useState({});
    const [cart, setCart] = useState({});
    const [number, setNumber] = useState(0);
    useEffect(() => {
        const cartStringified = localStorage.getItem('cart');
        const cartFromLS = JSON.parse(cartStringified);
        setCart(cartFromLS)
    }, [number])

    useEffect(() => {
        if (cart?.roomId) {
            fetch(`http://localhost:5000/room/${cart?.roomId}`)
                .then(res => res.json())
                .then(data => setTargetRoom(data))

        }
    }, [cart?.roomId])

    if (cart === null) {
        return <div className='flex items-center justify-center my-52'>
            <div>
                <div className='flex justify-center'>
                    <i className="fa-solid fa-cart-shopping text-7xl text-primary"></i>
                </div>
                <h1 className='text-4xl text-center font-[Poppins] my-6'>Your cart is empty</h1>
            </div>

        </div>
    }
    const { userName, phone, roomId, quantity, adult, child, checkIn, checkOut, totalDays, time } = cart;


    const totalCost = parseInt(targetRoom?.rentFee) * parseInt(totalDays) * parseInt(quantity);
    const totalCostDayZero = parseInt(targetRoom?.rentFee) * parseInt(quantity);
    const hanleDeleteBooking = () => {
        localStorage.removeItem('cart');
        setNumber((prev) => prev + 1);
    }
    const handleProceedBooking = () => {
        const rentCost = totalDays > 0 ? totalCost : totalCostDayZero;
        const email = user?.email;
        const roomName = targetRoom?.name;
        const perDayCost = targetRoom?.rentFee;
        const booking = {
            userName,
            email,
            phone,
            roomName,
            roomId,
            quantity,
            adult,
            child,
            checkIn,
            checkOut,
            totalDays,
            time,
            perDayCost,
            rentCost,
            status: 'Pending'
        }
        fetch('http://localhost:5000/bookOne', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        text: "Go to 'My Booking' to see your all bookings",
                        title: 'Booking Successful',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    localStorage.removeItem('cart');
                    navigate('/dashboard');

                }
                else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Something went wrong',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
    }
    return (
        <div className='font-[Poppins] min-h-screen'>
            <h3 className='lg:text-3xl text-2xl text-center my-5 font-bold'>Vacation Rental, Dhaka</h3>
            <div className="w-11/12 mx-auto">
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
                            <th className="p-3 text-left">Action</th>

                        </tr>
                    </thead>
                    <tbody className="flex-1 sm:flex-none text-center">
                        <tr className="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0">
                            <td className="border-grey-light border hover:bg-gray-100 p-3">{targetRoom.name}</td>
                            <td className="border-grey-light border hover:bg-gray-100 p-3">{checkIn}</td>
                            <td className="border-grey-light border hover:bg-gray-100 p-3">{time}</td>
                            <td className="border-grey-light border hover:bg-gray-100 p-3">{checkOut}</td>
                            <td className="border-grey-light border hover:bg-gray-100 p-3">{totalDays}</td>
                            <td className="border-grey-light border hover:bg-gray-100 p-3">{quantity}</td>
                            <td className="border-grey-light border hover:bg-gray-100 p-3">{adult}</td>
                            <td className="border-grey-light border hover:bg-gray-100 p-3">{child}</td>
                            <td className="border-grey-light border hover:bg-gray-100 p-3">${targetRoom?.rentFee}</td>
                            <td className="border-grey-light border hover:bg-gray-100 p-3">${totalDays > 0 ? totalCost : totalCostDayZero}</td>
                            <td onClick={hanleDeleteBooking} className="border-grey-light border hover:bg-gray-100 p-3 text-red-600 hover:text-red-700 hover:font-medium cursor-pointer">Delete</td>
                        </tr>
                    </tbody>
                </table>
                <div className='flex justify-center mb-5'>
                    <button onClick={handleProceedBooking} className='bg-primary px-3 text-white font-[poppins] py-2 rounded lg:ml-8 hover:border border-primary hover:bg-transparent hover:text-primary duration-500'>
                        Proceed Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;