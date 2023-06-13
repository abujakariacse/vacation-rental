import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import auth from "../firebase.init";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import Swal from "sweetalert2";
const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, upError] = useUpdateProfile(auth);
  const onSubmit = async (data) => {
    await createUserWithEmailAndPassword(data.email, data.password);
    await updateProfile({ displayName: data.name });
    const userInfo = {
      email: data.email,
      role: "user",
    };
    if (user) {
      navigate("/");
    }
    fetch(`http://localhost:5000/signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(userInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
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
            title: "Signed up successfully",
          });
        }
        navigate("/");
      });
    if (loading) {
      console.log(loading);
    }
  };

  return (
    <div className="font-[Poppins] bg-accent flex justify-center">
      <div className="card bg-base-100 lg:w-5/12 lg:shadow-md lg:rounded-md rounded-none lg:my-4 my-3 mb-8 lg:mb-6 lg:py-4">
        <div className="card-body">
          <h1 className="lg:text-3xl text-2xl font-bold mb-4 text-center">
            Create a new account
          </h1>
          <h1 className="text-center font-semibold text-primary text-xl my-2">
            {error?.message}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="mb-2 lg:w-9/12 mx-auto">
                <label className="block mb-1" htmlFor="name">
                  Full Name
                </label>
                <div>
                  <input
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Name is Required",
                      },
                      minLength: {
                        value: 4,
                        message: "Provide a valid name",
                      },
                    })}
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="input input-bordered w-full max-w-lg focus:outline-none focus:border-2 text-base input-field"
                  />
                  <label className="label">
                    {errors.name?.type === "required" && (
                      <span className="text-sm text-red-500">
                        {errors.name.message}
                        {loading}
                      </span>
                    )}
                    {errors.name?.type === "pattern" && (
                      <span className="text-sm text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </label>
                </div>
              </div>
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
              <div className="mb-2 lg:w-9/12 mx-auto">
                <label className="block mb-1" htmlFor="email">
                  Date of Birth
                </label>
                <div>
                  <input
                    {...register("DOB", {
                      required: {
                        value: true,
                        message: "DOB is Required",
                      },
                    })}
                    type="date"
                    className="input input-bordered w-full max-w-lg focus:outline-none focus:border-2 text-base email-field"
                  />
                  <label className="label">
                    {errors.DOB?.type === "required" && (
                      <span className="text-sm text-red-500">
                        {errors.DOB.message}
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
                      type="text"
                      name="password"
                      placeholder="Your password"
                      className="input input-bordered w-full max-w-lg focus:outline-none focus:border-2 text-base  password-field"
                    />
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
              <div className="lg:mt-3 mt-2 text-center">
                <input
                  className="btn lg:w-9/12 w-full btn-primary text-base normal-case text-white"
                  type="submit"
                  value="Sign Up"
                />
              </div>
            </div>
          </form>
          <div>
            <div>
              <h2 className="text-center mt-3 lg:text-base text-lg">
                Already have an account?{" "}
                <span className="font-semibold text-primary lg:inline block text-lg">
                  <Link to="/login">Sign In</Link>
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
