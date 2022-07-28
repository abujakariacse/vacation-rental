import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import WidthImg from '../images/icons/width.png';
import BedImg from '../images/icons/bed.png';
import InternetImg from '../images/icons/internet.png';
import Swal from 'sweetalert2';
import Loader from './Shared/Loader';

const RoomDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: roomDetail, isLoading } = useQuery('roomDetail', () =>
        fetch(`https://vacation-rental-aj.herokuapp.com/room/${id}`)
            .then(res => res.json())
    );
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    // Set Calender Minimum Date
    const today = new Date();
    const [minCheckInDate] = useState(new Date(today.toLocaleDateString()));
    const [maxCheckInDate] = useState(new Date(today.setDate(today.getDate() + 30)));

    // if checkIn date not available at first time this will work as default minTime. when checkin date will selected it will not work as min date
    const [minCheckOutDate] = useState(new Date(today.setDate(today.getDate() - 30)));

    const handleSubmit = (e) => {
        e.preventDefault();
        const userName = e.target.name.value;
        const checkIn = e.target.checkIn.value;
        const checkOut = e.target.checkOut.value;
        const adult = e.target.adult.value;
        const child = e.target.child.value;
        const roomId = e.target.room.value;
        const quantity = e.target.quantity.value;
        const phone = e.target.phone.value;
        const time = e.target.time.value;

        if (checkIn === "" || checkOut === "" || quantity === "DEFAULT" || adult === "DEFAULT" || child === "DEFAULT" || time === "") {
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Your booking form is incomplete',
            })
        }

        // To calculate the difference between checkIn and checkOut
        const dateOne = new Date(checkIn);
        const dateTwo = new Date(checkOut);
        const totalTime = Math.abs(dateTwo - dateOne);
        const days = Math.ceil(totalTime / (1000 * 60 * 60 * 24))

        const booking = {
            userName,
            checkIn,
            checkOut,
            adult,
            child,
            roomId,
            quantity,
            phone,
            time,
            totalDays: days
        }
        // to test localstorage
        const stringifiedBooking = JSON.stringify(booking);
        localStorage.setItem('cart', stringifiedBooking);
        navigate('/dashboard/cart');
    }

    if (isLoading) {
        return <Loader />
    };
    const { _id, name, image, rentFee, size, bed, view, max, detail } = roomDetail;
    return (
        <div className='bg-accent'>
            <div>
                <img className='room-img w-80 lg:w-11/12 mx-auto rounded-md' src={image} alt="" />
            </div>
            <div className='grid lg:grid-cols-2 grid-cols-1 lg:mx-28 font-serif pb-5'>
                <div className="card booking-card lg:w-96 mx-auto lg:mx-0 bg-base-100 shadow-xl rounded-md w-80 my-4 lg:my-0 lg:mt-14">
                    <div className="card-body">
                        <h2 className="text-2xl">Book your apartment</h2>
                        <form onSubmit={handleSubmit} className='my-4'>
                            <input type="text" name='name' placeholder="Your Name" className="input w-full max-w-xs bg-accent placeholder-black  my-2" required />

                            <div className='grid grid-cols-2 gap-5 my-4'>
                                <DatePicker
                                    minDate={minCheckInDate}
                                    maxDate={maxCheckInDate}
                                    selected={checkIn}
                                    onChange={(date) => setCheckIn(date)}
                                    name='checkIn'
                                    dateFormatCalendar='pp'
                                    autoComplete='off'
                                    className="input w-full max-w-xs bg-accent placeholder-black "
                                    placeholderText='Check-In'
                                />
                                <DatePicker
                                    minDate={checkIn ? checkIn : minCheckOutDate}
                                    name='checkOut'
                                    selected={checkOut}
                                    onChange={(date) => setCheckOut(date)}
                                    dateFormatCalendar='pp'
                                    autoComplete='off'
                                    className="input w-full max-w-xs bg-accent placeholder-black"
                                    placeholderText='Check-Out'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-5 my-4'>
                                <select defaultValue={'DEFAULT'} name='adult' className="select w-full max-w-xs bg-accent">
                                    <option disabled value='DEFAULT'>Adults</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                                <select defaultValue={'DEFAULT'} name='child' className="select w-full max-w-xs bg-accent">
                                    <option disabled value='DEFAULT'>Children</option>
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </div>
                            <div className='grid grid-cols-2 gap-5 my-4'>
                                <select disabled defaultValue={'DEFAULT'} name='room' className="select w-full max-w-xs bg-accent">
                                    <option value={_id}>{name}</option>
                                </select>
                                <select defaultValue={'DEFAULT'} name='quantity' className="select w-full max-w-xs bg-accent">
                                    <option disabled value='DEFAULT'>Quantity</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </div>
                            <div className='grid grid-cols-2 gap-5 my-2'>
                                <input autoComplete='off' type="number" name='phone' placeholder="Phone Number" className="input w-full max-w-xs bg-accent placeholder-black" required />
                                <input type="time" name='time' placeholder="Select Time" className="input w-full max-w-xs bg-accent placeholder-black " required />
                            </div>
                            <input type="submit" value="Book Apartment Now" className='btn btn-secondary hover:bg-transparent hover:text-primary text-white font-normal w-full mt-5 rounded-sm' />

                        </form>
                    </div>
                </div>
                <div className='mx-7 lg:mx-0'>
                    <h2 className='text-secondary mt-4'><Link to='/room'>Rooms and Suites</Link> <i className='fa-solid fa-angle-right text-xs'></i> <b>{name}</b></h2>
                    <h1 className='text-4xl text-secondary mt-6'>{name}</h1>
                    <h2 className='text-xl mb-6 mt-2'> <span className='font-bold'><i className="fa-solid fa-tag"></i> ${rentFee}</span> (per night)</h2>
                    <div>
                        <div className='grid md:grid-cols-3 grid-cols-1 lg:gap-10 gap-5'>
                            <div className='flex lg:block items-center gap-3'>
                                <img className='w-16 lg:ml-5' src={WidthImg} alt="" />
                                <h2>{size} ({(size?.slice(0, 2) * 10)}sq-ft)</h2>
                            </div>
                            <div className='flex lg:block items-center gap-3'>
                                <img className='w-16 lg:ml-5' src={BedImg} alt="" />
                                <h2>{bed} Queen-sized Bed</h2>
                            </div>
                            <div className='flex lg:block items-center gap-3'>
                                <img className='w-16 lg:ml-5' src={InternetImg} alt="" />
                                <h2>Internet Services</h2>
                            </div>
                        </div>
                        <div className='my-6'>
                            <h2 className='text-4xl text-secondary'>Room Details</h2>
                            <h4 className='text-base my-2'>{detail}</h4>
                            <p className='text-lg'><span className='font-bold'>View:</span> {view}, <span className='font-bold'>Holding capacity:</span> {max}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className='text-2xl'>In-room Amenities</h2>
                        <div className='grid lg:grid-cols-3 grid-cols-1 gap-10 mx-7 lg:mx-0'>
                            <div>
                                <p className='font-bold my-1'>For Your Comfort</p>
                                <ul className='list-disc text-lg'>
                                    <li>{bed} Queen-sized bed</li>
                                    <li>Executive writing table and stationery set</li>
                                    <li>Walk-in wardrobe</li>
                                    <li>Ensuite bathroom</li>
                                    <li>Bathrobes, slippers and hairdryer</li>
                                </ul>
                            </div>
                            <div>
                                <p className='font-bold my-1'>For Your Indulgence</p>
                                <ul className='list-disc text-lg'>
                                    <li>LCD television with local and cable channels</li>
                                    <li>Complimentary bottled water</li>
                                    <li>Daily newspaper on request</li>
                                </ul>
                            </div>
                            <div>
                                <p className='font-bold my-1'>For Your Convenience</p>
                                <ul className='list-disc text-lg'>
                                    <li>Wired and wireless Internet access</li>
                                    <li>IDD telephone</li>
                                    <li>Secure key-card access</li>
                                    <li>Personal digital safe</li>
                                    <li>24-hour in-room dining</li>
                                    <li>Daily turn-down service available upon request</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;