import React from 'react';
import OfferImg from '../../images/offer.webp';

const Offer = () => {
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
                    <div className='md:grid grid-cols-2 gap-10 my-4'>
                        <div className='flex my-4 justify-between'>
                            <div>
                                <i className="fa-solid fa-mug-hot text-5xl bg-secondary text-white rounded-full p-4"></i>
                            </div>
                            <div className='md:ml-5 ml-2'>
                                <h2 className='text-xl'>Tea Coffee</h2>
                                <p className='text-sm'> A small river named Duden flows by their place and supplies it with the necessary</p>
                            </div>
                        </div>
                        <div className='flex my-4 justify-between'>
                            <div>
                                <i className="fa-solid fa-shower text-5xl bg-secondary text-white rounded-full p-4"></i>
                            </div>
                            <div className='md:ml-5 ml-2'>
                                <h2 className='text-xl'>Hot Showers</h2>
                                <p className='text-sm'> A small river named Duden flows by their place and supplies it with the necessary</p>
                            </div>
                        </div>
                        <div className='flex my-4 justify-between'>
                            <div>
                                <i className="fa-solid fa-jug-detergent text-5xl bg-secondary text-white rounded-full p-4"></i>
                            </div>
                            <div className='md:ml-5 ml-2'>
                                <h2 className='text-xl'>Laundry</h2>
                                <p className='text-sm'> A small river named Duden flows by their place and supplies it with the necessary</p>
                            </div>
                        </div>
                        <div className='flex my-4 justify-between'>
                            <div>
                                <i className="fa-solid fa-fan text-5xl bg-secondary text-white rounded-full p-4"></i>
                            </div>
                            <div className='md:ml-5 ml-2'>
                                <h2 className='text-xl'>Air Conditioning</h2>
                                <p className='text-sm'> A small river named Duden flows by their place and supplies it with the necessary</p>
                            </div>
                        </div>
                        <div className='flex my-4 justify-between'>
                            <div>
                                <i className="fa-solid fa-wifi text-4xl bg-secondary text-white rounded-full p-4"></i>
                            </div>
                            <div className='md:ml-5 ml-2'>
                                <h2 className='text-xl'>Free Wifi</h2>
                                <p className='text-sm'> A small river named Duden flows by their place and supplies it with the necessary</p>
                            </div>
                        </div>
                        <div className='flex my-4 justify-between'>
                            <div>
                                <i className="fa-solid fa-fire-burner text-4xl bg-secondary text-white rounded-full p-4"></i>
                            </div>
                            <div className='md:ml-5 ml-2'>
                                <h2 className='text-xl'>Kitchen</h2>
                                <p className='text-sm'> A small river named Duden flows by their place and supplies it with the necessary</p>
                            </div>
                        </div>
                        <div className='flex my-4 justify-between'>
                            <div>
                                <i className="fa-solid fa-shirt text-3xl bg-secondary text-white rounded-full p-4"></i>
                            </div>
                            <div className='md:ml-5 ml-2'>
                                <h2 className='text-xl'>Ironing</h2>
                                <p className='text-sm'> A small river named Duden flows by their place and supplies it with the necessary</p>
                            </div>
                        </div>
                        <div className='flex my-4 justify-between'>
                            <div> <i className="fa-solid fa-lock text-4xl bg-secondary text-white rounded-full p-4"></i></div>
                            <div className='md:ml-5 ml-2'>
                                <h2 className='text-xl'>Lockers</h2>
                                <p className='text-sm'> A small river named Duden flows by their place and supplies it with the necessary</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offer;