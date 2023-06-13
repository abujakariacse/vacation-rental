import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import auth from "../firebase.init";
import {
  useSignInWithGoogle,
  useSignInWithGithub,
  useSignInWithFacebook,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import Swal from "sweetalert2";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
  const [signInWithGithub, gitUser, gitLoading, gitError] =
    useSignInWithGithub(auth);
  const [signInWithFacebook, fUser, fLoading, fError] =
    useSignInWithFacebook(auth);
  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    signInWithEmailAndPassword(data.email, data.password);
  };
  if (user || gUser || gitUser || fUser) {
    navigate("/");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "Signed in successfully",
    });
  }
  return (
    <div className="font-[Poppins] bg-accent flex justify-center">
      <div className="card bg-base-100 lg:w-5/12 lg:shadow-md lg:rounded-md rounded-none lg:my-4 my-3 mb-8 lg:mb-6 lg:py-4">
        <div className="card-body">
          <h1 className="lg:text-3xl text-2xl font-bold mb-6 text-center">
            Sign in to your account
          </h1>
          <span
            className={`${
              loading || gLoading || gitLoading || fLoading
                ? "loading loading-bars loading-lg mx-auto text-secondary"
                : "hidden"
            }`}
          ></span>
          <span
            className={`${
              error || gError || fError || gitError
                ? "block text-center my-3 text-xl text-primary font-semibold"
                : "hidden"
            }`}
          >
            {error?.message}
          </span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="mb-2 lg:w-9/12 mx-auto">
                <label className="block mb-1" htmlFor="email">
                  Email Address
                </label>
                <div>
                  <input
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email is Required",
                      },
                      pattern: {
                        value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                        message: "Provide a valid Email",
                      },
                    })}
                    type="text"
                    name="email"
                    placeholder="Your Email"
                    className="input input-bordered w-full max-w-lg focus:outline-none focus:border-2 text-base input-field"
                  />
                  <label className="label">
                    {errors.email?.type === "required" && (
                      <span className="text-sm text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                    {errors.email?.type === "pattern" && (
                      <span className="text-sm text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </label>
                </div>
              </div>
              <div>
                <div className="mb-2 lg:w-9/12 mx-auto">
                  <label className="block mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="input-group relative">
                    <input
                      {...register("password", {
                        required: {
                          value: true,
                          message: "Password is Required",
                        },
                        minLength: {
                          value: 6,
                          message: "Password must be 6 charecter or longer",
                        },
                      })}
                      type={`${showPassword ? "text" : "password"}`}
                      name="password"
                      placeholder="Your password"
                      className="input input-bordered w-full max-w-lg focus:outline-none focus:border-2 text-base  password-field"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="py-2 btn absolute right-1 bg-transparent text-black hover:bg-transparent border-none"
                    >
                      {" "}
                      <i
                        className={`fa-solid ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        } text-xl`}
                      ></i>
                    </span>
                  </div>
                  <label className="label">
                    {errors.password?.type === "required" && (
                      <span className="text-sm text-red-500">
                        {errors.password.message}
                      </span>
                    )}
                    {errors.password?.type === "minLength" && (
                      <span className="text-sm text-red-500">
                        {errors.password.message}
                      </span>
                    )}
                  </label>
                </div>
              </div>
              <div className="lg:w-9/12 mx-auto ">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="label">
                      <input
                        type="checkbox"
                        name="checkbox"
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text ml-3 lg:text-base text-xs cursor-pointer text-gray-500">
                        Remember me
                      </span>
                    </label>
                  </div>
                  <h4 className="text-primary font-semibold lg:text-base text-xs">
                    <Link to="/passwordreset">Forgot your password?</Link>
                  </h4>
                </div>
              </div>
              <div className="lg:mt-6 mt-2 text-center">
                <input
                  className="btn lg:w-9/12 w-full btn-primary text-base normal-case text-white"
                  type="submit"
                  value="Sign In"
                />
              </div>
            </div>
          </form>
          <div>
            <div className="lg:w-9/12 mx-auto lg:mt-6">
              <div className="divider">Or Continue With</div>
            </div>
            <div className="lg:w-8/12 w-11/12 mx-auto mt-6">
              <button
                onClick={() => signInWithGoogle()}
                className="btn btn-outline px-10 hover:bg-transparent hover:text-emerald-600"
              >
                <i className="fa-brands fa-google text-3xl"></i>
              </button>
              <span className="mx-2"></span>
              <button
                onClick={() => signInWithFacebook()}
                className="btn btn-outline px-10 hover:bg-transparent hover:text-blue-700"
              >
                <i className="fa-brands fa-facebook text-3xl"></i>
              </button>
              <span className="mx-2"></span>
              <button
                onClick={() => signInWithGithub()}
                className="btn btn-outline px-10 lg:inline hidden hover:bg-transparent hover:text-black"
              >
                <i className="fa-brands fa-github text-3xl"></i>
              </button>
            </div>
            <div>
              <h2 className="text-center mt-5 lg:text-base text-lg">
                Don't have an account?{" "}
                <span className="font-semibold text-primary lg:inline block text-lg">
                  <Link to="/register">Create Account</Link>
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
