import React from 'react';

const PrimaryButton = ({ children }) => {
    return (
        <button className='bg-secondary px-3 text-white font-[poppins] py-2 rounded lg:ml-8 hover:border border-primary hover:bg-transparent hover:text-primary duration-500'>
            {children}
        </button>
    );
};

export default PrimaryButton;