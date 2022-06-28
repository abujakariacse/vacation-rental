import React from 'react';
import { Parallax } from 'react-parallax';
import { Link } from 'react-router-dom';
import BannerImage from '../../images/banner.webp';

const GetReady = () => {
    return (
        <div>
            <Parallax bgImage={BannerImage} strength={400}>
                <div className="get-ready text-center py-16 font-serif getStarted-parallax">
                    <div>
                        <h1 className='text-6xl font-bold my-7 text-white'>Ready to get started</h1>
                        <p className='text-lg my-5 text-white'>It’s safe to book online with us! Get your dream stay in clicks or drop us a line with your questions.</p>
                        <Link to='/room'>
                            <button className='bg-secondary px-3 text-white font-[poppins] py-2 rounded lg:ml-8 hover:border border-primary hover:bg-transparent hover:text-primary duration-500'>
                                Book Now
                            </button>
                        </Link>
                        <span className='mx-3'></span>
                        <Link to='/contact'>
                            <button className='bg-white px-3 text-black font-[poppins] py-2 rounded lg:ml-8 hover:border border-white hover:bg-transparent hover:text-white duration-500'>
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div >
            </Parallax>
        </div>
    );
};

export default GetReady;

/* bg - [url('https://i.ibb.co/gJWwZzf/banner.jpg')] */