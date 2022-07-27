import React, { useEffect } from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';

const Booking = ({ booking }) => {
    const { _id, roomName, checkIn, checkOut, time, totalDays, quantity, adult, child, rentCost, status, userName, email, phone } = booking;
    const [selected, setSelected] = useState(status);
    useEffect(() => {
        const status = { status: selected };
        fetch(`http://localhost:5000/booking/update/${_id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(status)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.modifiedCount === 1) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2500,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'success',
                        title: 'Status Changed successfully'
                    })
                }
            })
    }, [selected, _id])
    return (
        <tr className="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0 text-center">
            <td className="border-grey-light border hover:bg-gray-100 p-3">{roomName}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{userName}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{email}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{phone}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{checkIn}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{time}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{checkOut}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{totalDays}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{quantity}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{adult}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">{child}</td>
            <td className="border-grey-light border hover:bg-gray-100 p-3">${rentCost}</td>
            <td className="border-grey-light border p-3 text-white hover:font-medium cursor-pointer rounded-sm text-center">
                <select defaultValue={selected} onChange={e => {
                    setSelected(e.target.value)

                }} className="select select-bordered w-full max-w-xs btn-primary text-sm">
                    {/* <option disabled className='bg-white text-gray-400 text-base'>{selected}</option> */}
                    <option className='bg-white text-neutral text-base'>Pending</option>
                    <option className='bg-white text-neutral text-base'>Rejected</option>
                    <option className='bg-white text-neutral text-base'>Approved</option>
                    <option className='bg-white text-neutral text-base'>Checkout</option>
                </select>
            </td>
            <td className="border-grey-light border hover:bg-gray-100 p-3 text-red-600 hover:text-red-700 hover:font-medium cursor-pointer text-xl text-center">
                <select className="select select-bordered w-full max-w-xs btn-primary text-sm">
                    <option className='bg-white text-neutral text-base'>UnPaid</option>
                    <option className='bg-white text-neutral text-base'>Paid</option>
                </select>
            </td>
        </tr>
    );
};

export default Booking;