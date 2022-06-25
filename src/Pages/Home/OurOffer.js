import React from 'react';
import OfferImg from '../../images/offer.webp';
import Amenities from '../Shared/Amenities';

const OurOffer = () => {
    const styles = {
        "display": 'md:grid',
        "gridCols": "grid-cols-2",
        "marginY": "my-4"
    }
    return (
        <div className='bg-accent md:py-16 py-6'>
            <div className='md:grid grid-cols-2 md:mx-20 gap-10'>
                <div className='mx-4 md:mx-0'>
                    <img src={OfferImg} alt="" />
                    <h1 className='md:text-3xl text-4xl my-4'>The most recommended vacation rental</h1>
                    <p className='text-base'>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
                </div>
                <div className='mt-6 md:mt-0 mx-4 md:ml-0 '>
                    <h1 className='text-2xl '>What we offer</h1>
                    <p className='text-base'>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                    <Amenities styles={styles}></Amenities>
                </div>
            </div>
        </div>
    );
};

export default OurOffer;