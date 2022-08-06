import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import Loader from './Shared/Loader';

const BlogDetail = () => {
    const { id } = useParams();
    const { data: blogdetail, isLoading } = useQuery('blogdetail', () =>
        fetch(`http://localhost:5000/blogdetail/${id}`)
            .then(res => res.json()
            )
    );
    let ratings = [1, 2, 3, 4];
    if (isLoading) {
        return <Loader />
    };
    const { image, date, role, title, post } = blogdetail;

    return (
        <div className='font-[Poppins] lg:w-full w-96'>
            <div className='pb-10'>
                <div className='flex justify-center my-3 mb-10 w-96 lg:w-full py-2'>
                    <img className='rounded ml-2' src={image} alt="" />
                </div>
                <div className='my-4 lg:flex grid grid-cols-2 justify-center gap-4 text-center lg:mx-14'>
                    <h4 className='bg-primary rounded-sm text-white lg:px-4 px-2 lg:py-1 lg:text-lg text-base lg:w-20 w-14 ml-3'>Hotel</h4>
                    <div>
                        <i className="fa-solid fa-calendar-days lg:text-lg"></i>
                        <span className='lg:text-lg ml-2'>{date}</span>
                    </div>
                    <span className='lg:text-lg text-base'>Author : Abu Jakaria<small className='lg:inline hidden'> ({role})</small></span>
                    <h4 className='lg:text-lg text-base'>Ratings:{
                        ratings.map(rating => <i
                            key={Math.random() * 4}
                            className="fa-solid fa-star text-yellow-400"></i>)
                    }<i className="fa-solid fa-star-half-stroke text-yellow-400"></i></h4>
                </div>
                <div>
                    <h1 className='lg:text-3xl text-2xl text-center my-7 font-semibold'>{title}</h1>
                    <p className='text-base text-justify lg:mx-12 mx-6'>{post}</p>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;