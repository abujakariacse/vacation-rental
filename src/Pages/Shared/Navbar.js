import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    let [open, setOpen] = useState(false);

    const handleNavClose = e => {
        setOpen(!open)
    }
    let links = [
        { name: 'Home', link: '/' },
        { name: 'About', link: '/about' },
        { name: 'Service', link: '/services' },
        { name: 'Appartment Rooms', link: '/appartmentrooms' },
        { name: 'Blog', link: '/blogs' },
        { name: 'Contact', link: '/contact' },

    ];

    return (
        <div className='sticky z-50 font-[Poppins]'>
            <div className='bg-rose-500 lg:flex justify-around py-2 hidden'>
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
            <div className='shadow-md lg:shadow-none w-full lg:top-12 left-0'>
                <div className='lg:flex flex items-center justify-between py-4  px-7 lg:mx-40'>
                    <div className='font-bold cursor-pointer text-xl'>
                        <Link to='/' className='text-2xl font-[poppins]'>Vacation<span className='text-rose-500'>Rental</span></Link>
                    </div>
                    <div onClick={() => setOpen(!open)} className='text-3xl absolute right-8 top-3 cursor-pointer lg:hidden'>
                        <i className={`${open ? 'fa-solid fa-x' : 'fa-solid fa-bars'}`}></i>
                    </div>
                    <ul className={`lg:flex lg:items-center lg:pb-0 pb-8 absolute lg:static bg-white lg:z-auto z-[-1] left-0 w-full lg:w-auto lg:pl-0 pl-7 transition-all duration-500 ease-in ${open ? 'top-16 opacity-100' : 'top-[-490px] opacity-0'} lg:opacity-100`}>
                        {
                            links.map(link => <li
                                className='lg:ml-8 text-base lg:my-0 my-5'
                                key={link.name}>
                                <Link onClick={handleNavClose} className='text-gray focus:bg-rose-500 focus:text-white px-3 py-2 rounded-md hover:text-rose-500 duration-500'
                                    to={link.link}>{link.name}</Link>
                            </li>)
                        }
                        <li className='lg:ml-8 text-base lg:my-0 my-5'>
                            <Link onClick={handleNavClose} className='text-gray focus:bg-rose-500 focus:text-white px-3 py-2 rounded-md hover:text-rose-500 duration-500'
                                to='/'>Login</Link>
                        </li>
                    </ul>

                </div>
            </div>
        </div>

    );
};

export default Navbar;