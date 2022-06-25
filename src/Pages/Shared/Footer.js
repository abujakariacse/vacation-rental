import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <div className='font-[Poppins]'>
            <footer className="footer p-10 bg-neutral text-white">
                <div>
                    <span className="footer-title">Services</span>
                    <Link to='/' className="link link-hover">Branding</Link>
                    <Link to='/' className="link link-hover">Design</Link>
                    <Link to='/' className="link link-hover">Marketing</Link>
                    <Link to='/' className="link link-hover">Advertisement</Link>
                </div>
                <div>
                    <span className="footer-title">Company</span>
                    <Link to='/' className="link link-hover">About us</Link>
                    <Link to='/' className="link link-hover">Contact</Link>
                    <Link to='/' className="link link-hover">Jobs</Link>
                    <Link to='/' className="link link-hover">Press kit</Link>
                </div>
                <div>
                    <span className="footer-title">Legal</span>
                    <Link to='/' className="link link-hover">Terms of use</Link>
                    <Link to='/' className="link link-hover">Privacy policy</Link>
                    <Link to='/' className="link link-hover">Cookie policy</Link>
                </div>
                <div>
                    <span className="footer-title">Newsletter</span>
                    <div className="form-control w-80">
                        <label className="label">
                            <span className="label-text text-white">Enter your email address</span>
                        </label>
                        <div className="relative">
                            <input type="text" placeholder="username@abc.com" className="input input-bordered w-full pr-16" />
                            <button className="btn btn-secondary absolute top-0 right-0 rounded-l-none">Subscribe</button>
                        </div>
                    </div>
                </div>
            </footer>
            <footer className="footer footer-center p-4 bg-neutral text-white">
                <div>
                    <p className='md:text-base select-none'>Copyright © {year} - All right reserved by <span>
                        <span className='md:inline block'></span>
                        <i className="text-rose-700 text-base fa-solid fa-angle-left"></i>
                        <span className='cursor-pointer' style={{ color: '#E21717' }}>
                            <a href="https://github.com/abujakariacse" target='_blank' rel='noreferrer'>abujakariacse/</a>
                        </span>
                        <i className="text-rose-700 text-base fa-solid fa-angle-right"></i>


                    </span></p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;