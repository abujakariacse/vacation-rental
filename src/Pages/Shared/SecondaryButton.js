import React from 'react';

const SecondaryButton = ({ children }) => {
    return (
        <button className='bg-white px-3 text-black font-[poppins] py-2 rounded lg:ml-8 hover:border border-white hover:bg-transparent hover:text-white duration-500'>
            {children}
        </button>
    );
};

export default SecondaryButton;