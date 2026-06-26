import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="min-h-[70vh] bg-accent font-[Poppins] flex items-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <span className="badge badge-primary badge-sm"></span>
              404 • Page not found
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-neutral">
              This page isn’t available.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral/70 leading-relaxed">
              The link may be broken, or the page may have been removed.
            </p>
            <div className="mt-3 text-sm text-neutral/60">
              Tried to access: <span className="font-mono">{location.pathname}</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/" className="btn btn-primary text-white">
                <i className="fa-solid fa-house mr-2"></i>
                Go to Home
              </Link>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Go back
              </button>
              <Link
                to="/contact"
                className="btn btn-ghost text-neutral hover:bg-white/60"
              >
                Contact support
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-secondary/30 via-primary/20 to-white/0 blur-2xl rounded-full"></div>
            <div className="relative bg-white/70 border border-white/60 rounded-2xl shadow-xl p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral/70">VacationRental</p>
                <span className="badge badge-secondary text-white">Oops</span>
              </div>
              <div className="mt-8">
                <div className="text-7xl font-extrabold text-primary leading-none">
                  404
                </div>
                <p className="mt-3 text-neutral/70">
                  Let’s get you back on track.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link to="/room" className="btn btn-secondary text-white">
                  Browse rooms
                </Link>
                <Link to="/blogs" className="btn btn-outline">
                  Read blogs
                </Link>
              </div>

              <div className="mt-6 text-xs text-neutral/50">
                If you believe this is an error, please contact us.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;