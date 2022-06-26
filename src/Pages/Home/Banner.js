import React from 'react';
import { useState } from 'react';
import PrimaryButton from '../Shared/PrimaryButton';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Parallax } from 'react-parallax';
import BgImage from '../../images/banner.webp';
import SecondaryButton from '../Shared/SecondaryButton';

const Banner = () => {
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const checkIn = e.target.checkIn.value;
        const checkOut = e.target.checkOut.value;
        const adult = e.target.adult.value;
        const child = e.target.child.value;
        const phone = e.target.phone.value;
        const time = e.target.time.value;

        const booking = {
            name,
            checkIn,
            checkOut,
            adult,
            child,
            phone,
            time
        }
        console.log(booking)
    }
    return (
        <div>
            <div className="min-h-screen font-[Poppins]">
                <Parallax bgClassName='parallax-image' bgImage={BgImage} strength={400}>
                    <div className='banner-gradient'>
                        <div className='min-h-screen grid lg:grid-cols-2 grid-cols-1 items-center justify-items-end lg:mx-28 font-serif'>
                            <div className='my-10 lg:my-0 mx-auto mt-28 lg:mt-0'>
                                <h4 className='text-white text-xl my-5'>Welcome to Vacation Rental</h4>
                                <h1 className="lg:text-6xl text-3xl font-semibold my-5 text-white">Rent an appartment</h1>
                                <h1 className="lg:text-6xl text-3xl font-semibold text-white">for your vacation</h1>
                                <div className='mt-6 lg:block flex justify-around'>
                                    <PrimaryButton>Learn More</PrimaryButton>
                                    <SecondaryButton>Contact Us</SecondaryButton>
                                </div>
                            </div>
                            <div className="card lg:w-96 mx-auto lg:mx-0 bg-base-100 shadow-xl rounded-md w-80 my-4 lg:my-0 min-h-fit">
                                <div className="card-body">
                                    <h2 className="text-2xl">Book your apartment</h2>
                                    <form onSubmit={handleSubmit} className='my-4'>
                                        <input type="text" name='name' placeholder="Your Name" className="input w-full max-w-xs bg-accent placeholder-black  my-2" />

                                        <div className='grid grid-cols-2 gap-5 my-4'>
                                            <DatePicker
                                                selected={checkIn}
                                                onChange={(date) => setCheckIn(date)}
                                                name='checkIn'
                                                dateFormatCalendar='pp'
                                                className="input w-full max-w-xs bg-accent placeholder-black "
                                                placeholderText='Check-In'
                                            />
                                            <DatePicker
                                                name='checkOut'
                                                selected={checkOut}
                                                onChange={(date) => setCheckOut(date)}
                                                dateFormatCalendar='pp'
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
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>
                                        </div>
                                        <div className='grid grid-cols-2 gap-5 my-2'>
                                            <input type="text" name='phone' placeholder="Phone Number" className="input w-full max-w-xs bg-accent placeholder-black" />
                                            <input type="time" name='time' placeholder="Select Time" className="input w-full max-w-xs bg-accent placeholder-black " />
                                        </div>
                                        <input type="submit" value="Book Apartment Now" className='btn btn-secondary hover:bg-transparent hover:text-primary text-white font-normal w-full mt-5 rounded-sm' />

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Parallax>
            </div >
        </div >
    );
};

export default Banner;