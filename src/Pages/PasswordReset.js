import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import auth from "../firebase.init";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const PasswordReset = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [error, setError] = useState("");
  const onSubmit = (data) => {
    const email = data.email;
    sendPasswordResetEmail(auth, email)
      .then(() => {
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
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Reset Email Sent Successfully",
          showCloseButton: true,
        });
      })
      .catch((error) => {
        setError(error?.message);
      });
  };
  return (
    <div className="font-[Poppins] bg-accent flex justify-center">
      <div className="card bg-base-100 lg:w-5/12 lg:shadow-md lg:rounded-md rounded-none lg:my-4 my-3 mb-8 lg:mb-6 lg:py-4">
        <div className="card-body">
          <h1 className="text-center text-xl font-medium mb-5 text-primary">
            Enter Your Email To Reset Password
          </h1>
          <span className="text-center text-primary font-medium">{error}</span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 lg:w-9/12 mx-auto">
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
            <div className="lg:mt-4 mt-2 text-center">
              <input
                className="btn lg:w-9/12 w-full btn-primary text-base normal-case text-white"
                type="submit"
                value="Reset Password"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
