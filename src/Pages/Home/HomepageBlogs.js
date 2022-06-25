import React from 'react';
import Blog from '../Shared/Blog';
import { useQuery } from "react-query";
import Loader from '../Shared/Loader';

const HomepageBlogs = () => {
    const { data: blogs, isLoading } = useQuery('blogs', () =>
        fetch('http://localhost:5000/blogs')
            .then(res => res.json()))
    if (isLoading) {
        return <Loader />
    }
    return (
        <div className='font-[Poppins] bg-accent py-12 text-center'>
            <h1 className='md:text-5xl text-2xl'>Latest news from our blog</h1>
            <p className='text-base text-primary font-semibold'>NEWS & BLOG</p>
            <div className='grid md:grid-cols-3 grid-cols-1 justify-items-center py-14'>
                {
                    blogs?.slice(0, 3).map(blog => <Blog
                        key={blog._id}
                        blog={blog}
                    ></Blog>)
                }
            </div>
        </div>
    );
};

export default HomepageBlogs;