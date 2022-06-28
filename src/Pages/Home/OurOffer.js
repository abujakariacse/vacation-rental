import React from 'react';
import OfferImg from '../../images/offer.webp';
import Amenities from '../Shared/Amenities';

const OurOffer = () => {
    const styles = {
        "display": 'lg:grid',
        "gridCols": "grid-cols-2",
        "marginY": "my-4"
    }
    return (
        <div className='bg-accent lg:py-16 py-6 font-[Poppins]'>
            <div className='lg:grid grid-cols-2 lg:mx-20 gap-10'>
                <div className='mx-4 lg:mx-0'>
                    <img className='rounded-md' src={OfferImg} alt="" />
                </div>
                <div className='mt-6 lg:mt-0 mx-4 lg:ml-0 '>
                    <h1 className='text-2xl '>What we offer</h1>
                    <p className='text-base'>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                    <Amenities styles={styles}></Amenities>
                </div>
            </div>
        </div>
    );
};

export default OurOffer;