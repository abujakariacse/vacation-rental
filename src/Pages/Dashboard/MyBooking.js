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
                    fetch(`https://vacation-rental-aj.herokuapp.com/mybooking/${id}`, {
                        method: 'DELETE',
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.deletedCount > 0) {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                })

                                Toast.fire({
                                    icon: 'success',
                                    title: 'Deleted successfully'
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
            <td className={`border-grey-light border p-3 text-white hover:font-medium select-none rounded-sm text-center ${status === 'Pending' && 'btn-info'} ${status === 'Approved' && 'btn-success'} ${status === 'Rejected' && 'btn-primary'} ${status === 'Checkout' && 'btn-warning'}`}>{status}</td>
            {
                status === 'Approved' || status === 'Checkout' ?
                    <td className={`border-grey-light border hover:bg-gray-100 p-3 text-green-600 text-xl text-center disabled`}><i className="fa-solid fa-circle-check"></i></td>
                    :
                    <td onClick={() => hanleDeleteBooking(_id)} className={`border-grey-light border hover:bg-gray-100 p-3 text-red-600 hover:text-red-700 hover:font-medium cursor-pointer text-xl text-center disabled`}><i className="fa-solid fa-trash-can"></i></td>

            }
        </tr>

    );
};

export default MyBooking;