import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const handleFormSubmit = e => {
        e.preventDefault();
    }
    return (
        <div className='font-[Poppins] bg-accent flex justify-center'>
            <div class="card bg-base-100 lg:w-5/12 lg:shadow-md lg:rounded-md rounded-none lg:my-6 lg:py-6">
                <div class="card-body">
                    <h1 className='lg:text-3xl text-2xl font-bold mb-6 text-center'>Sign in to your account</h1>
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <div className='mb-5 lg:w-9/12 mx-auto'>
                                <label className='block mb-1' htmlFor="email">Email Address</label>
                                <input type="email" placeholder="Your Email" className="input input-bordered w-full placeholder:pl-2 max-w-lg focus:outline-none focus:border-2" />
                            </div>
                            <div className='my-4 lg:w-9/12 mx-auto'>
                                <label className='block mb-1' htmlFor="password">Password</label>
                                <input type="password" placeholder="Your password" className="input input-bordered w-full max-w-lg focus:outline-none focus:border-2" />
                            </div>
                            <div className='lg:w-9/12 mx-auto '>
                                <div class="flex justify-between items-center">
                                    <div>
                                        <label className='label'>
                                            <input type="checkbox" class="checkbox checkbox-primary" />
                                            <span className='label-text ml-3 lg:text-base text-xs cursor-pointer'>Remember me</span>
                                        </label>
                                    </div>
                                    <h4 className='text-secondary lg:text-base text-xs'><Link to='/passwordreset'>Forgot your password?</Link></h4>
                                </div>
                            </div>
                            <div className='lg:mt-6 mt-2 text-center'>
                                <input className='btn lg:w-9/12 w-full btn-primary text-base normal-case text-white' type="submit" value="Sign In" />
                            </div>
                            <div className='lg:w-9/12 mx-auto lg:mt-10'>
                                <div class="divider">Or Continue With</div>
                            </div>
                            <div className='lg:w-8/12 w-11/12 mx-auto mt-6'>
                                <button className="btn btn-outline px-10 hover:bg-transparent hover:text-black">
                                    <i className="fa-brands fa-google text-3xl text-gray-600"></i>
                                </button>
                                <span className='mx-2'></span>
                                <button className="btn btn-outline px-10 hover:bg-transparent hover:text-black">
                                    <i className="fa-brands fa-facebook text-3xl text-gray-600"></i>
                                </button>
                                <span className='mx-2'></span>
                                <button className="btn btn-outline px-10 lg:inline hidden hover:bg-transparent hover:text-black">
                                    <i className="fa-brands fa-github text-3xl text-gray-600"></i>
                                </button>
                            </div>
                            <div>
                                <h2 className='text-center mt-5'>Don't have an account? <span className='font-semibold'><Link to='register'>Create One</Link></span></h2>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;