import React from 'react';
import BlogsBannaer from '../images/blog-1.webp';
import { Parallax } from 'react-parallax';
import Loader from './Shared/Loader';
import Blog from './Shared/Blog';
import useBlogs from '../hooks/useBlogs';
const Blogs = () => {
    const [blogs, isLoading] = useBlogs();
    if (isLoading) {
        return <Loader />
    }
    return (
        <div className=' min-h-screen'>
            <Parallax bgImage={BlogsBannaer} bgImageStyle={{ height: '600px', width: '100%' }} strength={400} bgClassName='parallax-image'>
                <div className='parallex-gradient h-96 flex justify-center items-center'>
                    <div>
                        <p className='text-lg text-white text-center mt-14 md:mt-0'>Home <i className='fa-solid fa-angle-right text-xs'></i> Blogs <i className='fa-solid fa-angle-right text-xs'></i></p>
                        <h1 className='md:text-6xl text-4xl font-serif text-white font-semibold md:mt-16'>Blogs</h1>
                    </div>
                </div>

            </Parallax>
            <div className='grid md:grid-cols-3 grid-cols-1 justify-items-center py-14'>
                {
                    blogs?.map(blog => <Blog
                        key={blog._id}
                        blog={blog}
                    ></Blog>)
                }
            </div>
        </div>
    );
};

export default Blogs;