import React from 'react';
import { Parallax } from 'react-parallax';
import ConactBanner from '../images/blog-4.webp';
const Contact = () => {
    return (
        <div className='min-h-screen'>
            <Parallax bgImage={ConactBanner} bgImageStyle={{ height: '600px', width: '100%' }} strength={400} bgClassName='parallax-image'>
                <div className='parallex-gradient h-96 flex justify-center items-center'>
                    <div>
                        <p className='text-lg text-white text-center mt-14 md:mt-0'>Home <i className='fa-solid fa-angle-right text-xs'></i> Contact <i className='fa-solid fa-angle-right text-xs'></i></p>
                        <h1 className='md:text-6xl text-4xl font-serif text-white font-semibold md:mt-16'>Contact</h1>
                    </div>
                </div>

            </Parallax>
            <div className='flex justify-center gap-10 font-[Poppins] my-12'>
                <div className="card w-6/12 bg-base-100 shadow-xl py-12 px-8">
                    <h2 className='text-4xl'>Get in touch</h2>
                    <form>
                        <div className="grid grid-cols-2 gap-12">
                            <div className='my-4'>
                                <label className='block font-semibold mb-3' htmlFor="name">Full Name</label>
                                <input type="text" placeholder="Name" className="input input-bordered w-full max-w-xs focus:outline-none" />
                            </div>
                            <div className='my-4'>
                                <label className='block font-semibold mb-3' htmlFor="email">Your Email</label>
                                <input type="email" placeholder="Email" className="input input-bordered w-full max-w-xs focus:outline-none" />
                            </div>

                        </div>
                        <div className='my-4'>
                            <label className='block font-semibold mb-3' htmlFor="subject">Subject</label>
                            <input type="text" placeholder="Subject" className="input input-bordered w-full  focus:outline-none" />
                        </div>
                        <div className='my-4'>
                            <label className='block font-semibold mb-3' htmlFor="message">Message</label>
                            <textarea className="w-full focus:outline-none textarea textarea-bordered" placeholder="Your Message"></textarea>
                        </div>
                        <div className='text-center'>
                            <input className='bg-secondary px-6 py-3 rounded-md text-white mx-auto cursor-pointer font-semibold mb-3' type="submit" value="Send Message" />
                        </div>
                    </form>
                </div>
                <div class="card w-96 bg-secondary shadow-xl text-white font-[Poppins]">
                    <div class="card-body">
                        <h1 className='text-4xl font-semibold mb-3'>Let's get in touch</h1>
                        <h4 className='text-base'>We're open for any suggestion or just to have a chat</h4>
                        <div className='flex gap-4 mb-4 mt-8'>
                            <i className="text-3xl border p-2 px-3 rounded-full fa-solid fa-location-dot"></i>
                            <h4 className='text-base'><span className='font-bold'>Address:</span> 198 West 21th Street, Suite 721 New York NY 10016</h4>
                        </div>
                        <div className='flex gap-4 mb-4'>
                            <i className="text-3xl border p-2 px-3 rounded-full fa-solid fa-phone"></i>
                            <h4 className='text-base'><span className='font-bold'>Phone:</span> + 1235 2355 98</h4>
                        </div>
                        <div className='flex gap-4 mb-4'>
                            <i className="text-3xl border p-2 px-3 rounded-full fa-solid fa-envelope"></i>
                            <h4 className='text-base'><span className='font-bold'>Email:</span>info@yoursite.com</h4>
                        </div>
                        <div className='flex gap-4 mb-4'>
                            <i className="text-3xl border p-2 px-3 rounded-full fa-solid fa-earth-asia"></i>
                            <h4 className='text-base'><span className='font-bold'>Website:</span>yoursite.com</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;