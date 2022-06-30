import React from 'react';
import { Link } from 'react-router-dom';

const Blog = ({ blog, handleBlogLoad }) => {
    const { _id, image, title, description, date, role } = blog;
    return (
        <div onClick={() => handleBlogLoad(_id)} className="card lg:w-96 w-80 mx-auto lg:mx-0 bg-base-100 shadow-xl my-4 rounded-sm cursor-pointer">
            <img className='rounded-sm' src={image} alt="blog" />
            <div className="card-body items-center text-center">
                <p><span className='text-primary'>{date} </span><span className='text-primary'>By {role}</span></p>
                <h2 className="card-title"><Link to='/'>{title}</Link></h2>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default Blog;