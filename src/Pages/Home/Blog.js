import React from 'react';
import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {
    const { image, title, description, date, role } = blog;
    return (
        <div class="card md:w-96 w-80 mx-auto md:mx-0 bg-base-100 shadow-xl my-4 rounded-sm">
            <img className='rounded-sm' src={image} alt="blog" class="rounded" />
            <div class="card-body items-center text-center">
                <p><span className='text-primary'>{date} </span><span className='text-primary'>By {role}</span></p>
                <h2 class="card-title"><Link to='/'>{title}</Link></h2>
                <p>{description}</p>

            </div>
        </div>
    );
};

export default Blog;