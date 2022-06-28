import React from 'react';

const ContentLoading = () => {
    return (
        <div className='font-[Poppins]'>
            <h2 className='text-3xl text-center my-5'>Loading...</h2>
            <div className='flex justify-center'>
                <progress class="progress w-56 progress-primary"></progress>
            </div>

        </div>
    );
};

export default ContentLoading;