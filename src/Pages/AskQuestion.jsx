import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import Loader from "./Shared/Loader.jsx";
import { ENDPOINT } from "../config/env";

const AskQuestion = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      category: "Booking",
      tags: "",
      details: "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8),
      userEmail: user?.email || null,
      userName: user?.displayName || "",
    };

    try {
      const res = await fetch(`${ENDPOINT}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.ok && result.insertedId) {
        toast.success("Question submitted successfully!");
        reset();
        navigate("/dashboard/myquestions");
      } else {
        toast.error(result.error || "Failed to submit question.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    }
  };

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-accent font-[Poppins] flex items-center">
        <div className="w-full max-w-xl mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-neutral">Sign in required</h1>
            <p className="mt-2 text-neutral/70">
              Please log in to ask a question so we can associate it with your account.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/login" className="btn btn-primary text-white">
                Go to Login
              </Link>
              <Link to="/" className="btn btn-outline">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-[70vh] bg-accent font-[Poppins]">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral tracking-tight">
              Ask a question
            </h1>
            <p className="mt-2 text-neutral/70">
              Get help fast. Share clear details and we’ll respond with the best next step.
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-ghost">
            Back
          </Link>
        </div>

        <div className="mt-6 bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">
                <span className="label-text font-semibold text-neutral">Title</span>
              </label>
              <input
                className="input input-bordered w-full bg-white/80"
                placeholder="e.g. How do I change my booking dates?"
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 8, message: "Title should be at least 8 characters" },
                  maxLength: { value: 120, message: "Title is too long" },
                })}
              />
              {errors.title?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold text-neutral">Category</span>
                </label>
                <select
                  className="select select-bordered w-full bg-white/80"
                  {...register("category", { required: true })}
                >
                  <option>Booking</option>
                  <option>Payment</option>
                  <option>Account</option>
                  <option>Rooms</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold text-neutral">Tags</span>
                  <span className="label-text-alt text-neutral/60">comma-separated</span>
                </label>
                <input
                  className="input input-bordered w-full bg-white/80"
                  placeholder="booking, payment, refund"
                  {...register("tags", {
                    maxLength: { value: 80, message: "Too many characters" },
                  })}
                />
                {errors.tags?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold text-neutral">Details</span>
                <span className="label-text-alt text-neutral/60">include what you tried</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full bg-white/80 min-h-[160px]"
                placeholder="Describe the issue clearly…"
                {...register("details", {
                  required: "Details are required",
                  minLength: { value: 20, message: "Please add a bit more detail" },
                  maxLength: { value: 2000, message: "Details are too long" },
                })}
              />
              {errors.details?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.details.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <p className="text-sm text-neutral/60">
                Signed in as <span className="font-semibold">{user.email}</span>
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary text-white"
              >
                {isSubmitting ? "Submitting…" : "Submit question"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AskQuestion;

