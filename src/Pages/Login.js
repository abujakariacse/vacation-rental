import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleFormSubmit = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log(email, password);
    }
    return (
        <div className='font-[Poppins] bg-accent flex justify-center'>
            <div className="card bg-base-100 lg:w-5/12 lg:shadow-md lg:rounded-md rounded-none lg:my-6 my-3 mb-8 lg:mb-6 lg:py-6">
                <div className="card-body">
                    <h1 className='lg:text-3xl text-2xl font-bold mb-6 text-center'>Sign in to your account</h1>
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <div className='mb-5 lg:w-9/12 mx-auto'>
                                <label className='block mb-1' htmlFor="email">Email Address</label>
                                <input type="email" name='email' placeholder="Your Email" className="input input-bordered w-full max-w-lg focus:outline-none focus:border-2 text-base email-field" required />
                            </div>
                            <div>
                                <div className='my-4 lg:w-9/12 mx-auto'>
                                    <label className='block mb-1' htmlFor="password">Password</label>
                                    <div className='input-group relative'>
                                        <input type={`${showPassword ? 'text' : 'password'}`} name='password' placeholder="Your password" className="input input-bordered w-full max-w-lg focus:outline-none focus:border-2 text-base  password-field" />
                                        <span onClick={() => setShowPassword(!showPassword)} className='py-2 btn absolute right-1 bg-transparent text-black hover:bg-transparent border-none'> <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xl`}></i></span>
                                    </div>
                                </div>
                            </div>
                            <div className='lg:w-9/12 mx-auto '>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <label className='label'>
                                            <input type="checkbox" name='checkbox' className="checkbox checkbox-primary" />
                                            <span className='label-text ml-3 lg:text-base text-xs cursor-pointer text-gray-500'>Remember me</span>
                                        </label>
                                    </div>
                                    <h4 className='text-primary font-semibold lg:text-base text-xs'><Link to='/passwordreset'>Forgot your password?</Link></h4>
                                </div>
                            </div>
                            <div className='lg:mt-6 mt-2 text-center'>
                                <input className='btn lg:w-9/12 w-full btn-primary text-base normal-case text-white' type="submit" value="Sign In" />
                            </div>
                        </div>
                    </form>
                    <div>

                        <div className='lg:w-9/12 mx-auto lg:mt-10'>
                            <div className="divider">Or Continue With</div>
                        </div>
                        <div className='lg:w-8/12 w-11/12 mx-auto mt-6'>
                            <button className="btn btn-outline px-10 hover:bg-transparent hover:text-blue-600">
                                <i className="fa-brands fa-google text-3xl"></i>
                            </button>
                            <span className='mx-2'></span>
                            <button className="btn btn-outline px-10 hover:bg-transparent hover:text-blue-700">
                                <i className="fa-brands fa-facebook text-3xl"></i>
                            </button>
                            <span className='mx-2'></span>
                            <button className="btn btn-outline px-10 lg:inline hidden hover:bg-transparent hover:text-black">
                                <i className="fa-brands fa-github text-3xl"></i>
                            </button>
                        </div>
                        <div>
                            <h2 className='text-center mt-5'>Don't have an account? <span className='font-semibold text-primary'><Link to='register'>Create Account</Link></span></h2>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;