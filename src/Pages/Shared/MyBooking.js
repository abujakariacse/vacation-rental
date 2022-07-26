import React from 'react';
import Swal from 'sweetalert2';
const MyBooking = ({ booking }) => {
    const { _id, roomName, checkIn, checkOut, time, totalDays, quantity, adult, child, perDayCost, rentCost, status } = booking;

    const hanleDeleteBooking = id => {
        Swal.fire({
            title: 'Are You Sure?',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#198754',
            showDenyButton: true,
            denyButtonText: 'No'
        })
            .then(result => {
                if (result.isConfirmed) {
                    fetch(`http://localhost:5000/mybooking/${id}`, {
                        method: 'DELETE',
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.deletedCount > 0) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Booking Removed',
                                    text: 'Booking successfully removed',
                                    showConfirmButton: false,
                                    timer: 1200
                                })
                            }
                        })
                }
            })
    }
    return (

        <tr className="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0 text-center">
            <td className="border-grey-light border hover:bg-gray-100 p-3">{roomName}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{checkIn}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{time}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{checkOut}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{totalDays}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{quantity}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{adult}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{child}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">${perDayCost}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">${rentCost}</td>
            <td className="border-grey-light border p-3 text-white hover:font-medium cursor-pointer bg-primary rounded-sm text-center">{status}</td>
            <td onClick={() => hanleDeleteBooking(_id)} className="border-grey-light border hover:bg-gray-100 p-3 text-red-600 hover:text-red-700 hover:font-medium cursor-pointer text-xl text-center"><i className="fa-solid fa-trash-can"></i></td>
        </tr>

    );
};

export default MyBooking;