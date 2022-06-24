import React from 'react';

const Button = ({ children }) => {
    return (
        <button className='focus:bg-rose-500 focus:text-white focus:px-4 text-gray font-[poppins] py-2 rounded md:ml-8 hover:bg-rose-600 duration-500'>
            {children}
        </button>
    );
};

export default Button;