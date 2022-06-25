import React from 'react';

const Amenities = ({ styles }) => {
    const { display, gridCols, marginX, paddingY } = styles;
    /* mainCSS: md:grid grid-cols-4 gap-10 my-4 md:mx-24 */
    return (
        <div>
            <div className={`${display} ${gridCols} ${marginX} ${paddingY} gap-10`}>
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
    );
};

export default Amenities;