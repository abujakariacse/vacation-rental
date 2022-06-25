import React from 'react';
import Blog from './Blog';

const Blogs = () => {
    const blogs = [
        {
            "_id": 1,
            "image": "https://i.ibb.co/CMTBpJB/blog-1.jpg",
            "title": "Work Hard, Party Hard in a Luxury Chalet in the Alps",
            "description": "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia",
            "date": "January 30, 2020",
            "role": " Admin"
        },
        {
            "_id": 2,
            "image": "https://i.ibb.co/kS2JRTM/blog-2.jpg",
            "title": "Work Hard, Party Hard in a Luxury Chalet in the Alps",
            "description": "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia",
            "date": "January 30, 2020",
            "role": " Admin"
        },
        {
            "_id": 3,
            "image": "https://i.ibb.co/dQsw5TC/blog-3.jpg",
            "title": "Work Hard, Party Hard in a Luxury Chalet in the Alps",
            "description": "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia",
            "date": "January 30, 2020",
            "role": " Admin"
        }
    ]
    return (
        <div className='font-[Poppins] bg-accent py-12 text-center'>
            <h1 className='md:text-5xl text-2xl'>Latest news from our blog</h1>
            <p className='text-base text-primary font-semibold'>NEWS & BLOG</p>
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