import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar = () => {
    let links = [
        { name: 'Home', link: '/home' },
        { name: 'About', link: '/about' },
        { name: 'Service', link: '/service' },
        { name: 'Appartment Rooms', link: '/room' },
        { name: 'Blog', link: '/blog' },
        { name: 'Contact', link: '/contact' },

    ];
    let [open, setOpen] = useState(false);
    return (
        <div>
            <div className='bg-rose-500 md:flex justify-around py-2 hidden'>
                <div>
                    <h3 className='text-white font-[poppins] text-sm'>Phone: +8801316460386 or Email: abujakariacse@gmail.com</h3>
                </div>
                <div>
                    <i className="text-white mr-4 fa-brands fa-facebook-f"></i>
                    <i className="text-white mr-4 fa-brands fa-twitter"></i>
                    <i className="text-white mr-4 fa-brands fa-instagram"></i>
                    <i className="text-white mr-4 fa-brands fa-dribbble"></i>
                </div>
            </div>
            <div className='shadow-md md:shadow-none w-full fixed md:top-12 left-0'>
                <div className='md:flex flex items-center justify-between py-4  px-7 md:mx-40'>
                    <div className='font-bold cursor-pointer text-xl'>
                        <h3 className='text-2xl font-[poppins]'>Vacation<span className='text-rose-500'>Rental</span></h3>
                    </div>
                    <div onClick={() => setOpen(!open)} className='text-3xl absolute right-8 top-3 cursor-pointer md:hidden'>
                        <i className={`${open ? 'fa-solid fa-x' : 'fa-solid fa-bars'}`}></i>
                    </div>
                    <ul className={`md:flex md:items-center md:pb-0 pb-8 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-7 transition-all duration-500 ease-in ${open ? 'top-16 opacity-100' : 'top-[-490px] opacity-0'} md:opacity-100`}>
                        {
                            links.map(link => <li
                                className='md:ml-8 text-base font-[poppins] md:my-0 my-5'
                                key={link.name}>
                                <Link className='text-gray focus:bg-rose-500 focus:text-white  focus:px-4 py-2 rounded-md hover:text-rose-500 duration-500'
                                    to={link.link}>{link.name}</Link>
                            </li>)
                        }
                        <Button>Login</Button>

                    </ul>

                </div>
            </div>
        </div>

    );
};

export default Navbar;