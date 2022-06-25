import React from 'react';
import Button from '../Shared/Button';
import { Parallax } from 'react-parallax';
import BannerImage from '../../images/banner.webp';

const GetReady = () => {
    return (
        <div>
            <Parallax bgImage={BannerImage} strength={400}>
                <div className="get-ready text-center py-16 font-serif getStarted-parallax">
                    <div>
                        <h1 className='text-6xl font-bold my-7 text-white'>Ready to get started</h1>
                        <p className='text-lg my-5 text-white'>It’s safe to book online with us! Get your dream stay in clicks or drop us a line with your questions.</p>
                        <Button>Book Now</Button><span className='mx-3'></span>
                        <Button>Contact Us</Button>
                    </div>
                </div >
            </Parallax>
        </div>
    );
};

export default GetReady;

/* bg - [url('https://i.ibb.co/gJWwZzf/banner.jpg')] */