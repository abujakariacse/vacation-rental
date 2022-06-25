import React from 'react';
import Button from '../Shared/Button';

const GetReady = () => {
    return (
        <div className="get-ready text-center bg-accent p-10 bg-[url('https://i.ibb.co/gJWwZzf/banner.jpg')]">
            <div>
                <h1 className='text-5xl font-bold my-7 text-black'>Ready to get started</h1>
                <p className='text-base my-5 text-black'>It’s safe to book online with us! Get your dream stay in clicks or drop us a line with your questions.</p>
                <Button>Book Now</Button>
                <Button>Contact Us</Button>
            </div>
        </div >
    );
};

export default GetReady;