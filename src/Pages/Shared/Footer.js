import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Footer = () => {
    const onSubmit = e => {
        e.preventDefault();
        const email = e.target.emailField.value;
        fetch(`http://localhost:5000/subscribe?email=${email}`, {
            method: 'POST',
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
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
                        title: 'Subscribed successfully'
                    })
                }
                else {
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
                        title: 'Already subscribed'
                    })
                }
                e.target.reset();
            })


    }
    const year = new Date().getFullYear();
    return (
        <div className='font-[Poppins]'>
            <footer className="footer p-10  bg-neutral text-white">
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
                        <form onSubmit={onSubmit} className="relative">
                            <input
                                name='emailField' type="text" placeholder="username@abc.com" className="input input-bordered w-full pr-16 text-black" required />
                            <input className="btn btn-secondary text-white absolute top-0 right-0 rounded-l-none" type="submit" value="Subscribe" />
                        </form>
                    </div>
                </div>
            </footer>
            <footer className="footer footer-center p-4 bg-neutral text-white">
                <div>
                    <p className='lg:text-base select-none'>Copyright © {year} - All right reserved by
                        <span>
                            <span className='lg:inline block'></span>
                            <i className="text-rose-700 text-base fa-solid fa-angle-left"></i>
                            <span className='cursor-pointer' style={{ color: '#E21717' }}>
                                <a href="https://github.com/abujakariacse" target='_blank' rel='noreferrer'>abujakariacse/</a>
                            </span>
                            <i className="text-rose-700 text-base fa-solid fa-angle-right"></i>
                        </span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;