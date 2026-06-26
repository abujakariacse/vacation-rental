import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Footer = () => {
  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target.emailField.value;
    fetch(`${import.meta.env.VITE_ENDPOINT}/subscribe?email=${email}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          toast.success("Subscribed successfully");
        } else {
          toast.success("Already subscribed");
        }
        e.target.reset();
      });
  };
  const year = new Date().getFullYear();
  return (
    <footer className="font-[Poppins] bg-base-300 text-base-content">
      <div className="app-container py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="w-10 h-10 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                <i className="fa-solid fa-house-chimney text-secondary"></i>
              </span>
              <span className="text-xl font-bold tracking-tight">VacationRental</span>
            </Link>
            <p className="mt-4 text-sm text-base-content/70 leading-relaxed max-w-md">
              Book comfortable stays with confidence. Browse curated rooms, check availability, and
              manage your bookings in one place.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                className="w-10 h-10 rounded-2xl border border-base-content/15 bg-base-100/10 hover:bg-base-100/15 transition flex items-center justify-center"
                href="#"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                className="w-10 h-10 rounded-2xl border border-base-content/15 bg-base-100/10 hover:bg-base-100/15 transition flex items-center justify-center"
                href="#"
                aria-label="Twitter"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a
                className="w-10 h-10 rounded-2xl border border-base-content/15 bg-base-100/10 hover:bg-base-100/15 transition flex items-center justify-center"
                href="#"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold tracking-wide text-base-content">Explore</p>
              <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                <li>
                  <Link to="/rooms" className="hover:text-base-content transition">
                    Rooms
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="hover:text-base-content transition">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-base-content transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-base-content transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-wide text-base-content">Support</p>
              <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                <li>
                  <Link to="/askQuestion" className="hover:text-base-content transition">
                    Help center
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-base-content transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-base-content transition">
                    My bookings
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="text-sm font-semibold tracking-wide text-base-content">Legal</p>
              <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                <li>
                  <a className="hover:text-base-content transition" href="#">
                    Terms
                  </a>
                </li>
                <li>
                  <a className="hover:text-base-content transition" href="#">
                    Privacy
                  </a>
                </li>
                <li>
                  <a className="hover:text-base-content transition" href="#">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold tracking-wide text-base-content">Newsletter</p>
            <p className="mt-4 text-sm text-base-content/70">
              Get travel tips and new listings. No spam.
            </p>
            <form onSubmit={onSubmit} className="mt-4">
              <label className="text-xs text-base-content/70 font-semibold">Email</label>
              <div className="mt-2 flex gap-2">
                <input
                  name="emailField"
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full bg-base-100/10 border-base-content/15 text-base-content placeholder:text-base-content/50 focus:outline-none focus:border-secondary/60"
                  required
                />
                <button type="submit" className="btn btn-secondary text-white shrink-0">
                  Subscribe
                </button>
              </div>
            </form>

            <div className="mt-6 text-sm text-base-content/70">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-secondary"></i>
                <p>Tejgaon Industrial Area, Dhaka</p>
              </div>
              <div className="mt-3 flex items-start gap-3">
                <i className="fa-solid fa-envelope mt-1 text-secondary"></i>
                <p>info@yoursite.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-base-content/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-base-content/60">
            © {year} VacationRental. All rights reserved.
          </p>
          <p className="text-sm text-base-content/60 select-none">
            Built by{" "}
            <a
              className="text-secondary hover:underline"
              href="https://github.com/abujakariacse"
              target="_blank"
              rel="noreferrer"
            >
              abujakariacse
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
