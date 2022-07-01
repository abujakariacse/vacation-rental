import React from 'react';
import { ThreeCircles } from 'react-loader-spinner';

const Loader = () => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <ThreeCircles
                color="#F43F5E"
                height={110}
                width={110}

            />
        </div>
    );
};

export default Loader;