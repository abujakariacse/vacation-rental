import React from 'react';

const Button = ({ children }) => {
    return (
        <button className='bg-rose-500 px-3 text-white font-[poppins] py-2 rounded md:ml-8 hover:border border-primary hover:bg-transparent hover:text-primary duration-500'>
            {children}
        </button>
    );
};

export default Button;