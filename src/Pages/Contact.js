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
        </div>
    );
};

export default Contact;