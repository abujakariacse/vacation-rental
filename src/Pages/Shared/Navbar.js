import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";
import auth from "../../firebase.init";
import Loader from "./Loader";

const Navbar = () => {
  let [open, setOpen] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth);
    navigate("/login");
  };
  console.log();
  const handleNavClose = (e) => {
    setOpen(!open);
  };
  let links = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Service", link: "/services" },
    { name: "Room", link: "/room" },
    { name: "Blog", link: "/blogs" },
    { name: "Contact", link: "/contact" },
  ];
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="sticky z-50 font-[Poppins]">
      <div className="bg-rose-500 lg:flex justify-around py-2 hidden">
        <div>
          <h3 className="text-white font-[poppins] text-sm">
            Phone: +8801316460386 or Email: contact@vacationrental.com
          </h3>
        </div>
        <div>
          <a
            href="https://facebook.com/vacation-rental"
            target="_blank"
            rel="noreferrer"
          >
            <i className="text-white mr-4 fa-brands fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com/vacation-rental"
            target="_blank"
            rel="noreferrer"
          >
            <i className="text-white mr-4 fa-brands fa-twitter"></i>
          </a>
          <a
            href="https://instagram.com/vacation-rental"
            target="_blank"
            rel="noreferrer"
          >
            <i className="text-white mr-4 fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://dribble.com/vacationrental"
            target="_blank"
            rel="noreferrer"
          >
            <i className="text-white mr-4 fa-brands fa-dribbble"></i>
          </a>
        </div>
      </div>
      <div className="nav shadow-md lg:shadow-none w-full lg:top-12 left-0">
        <div className="lg:flex flex items-center justify-between py-4  px-7 lg:mx-40">
          <div className="font-bold cursor-pointer text-xl">
            <Link to="/" className="text-2xl font-[poppins]">
              Vacation<span className="text-rose-500">Rental</span>
            </Link>
          </div>
          <div
            onClick={() => setOpen(!open)}
            className="text-3xl absolute right-8 top-3 cursor-pointer lg:hidden"
          >
            <i className={`${open ? "fa-solid fa-x" : "fa-solid fa-bars"}`}></i>
          </div>
          <ul
            className={`lg:flex lg:items-center lg:pb-0 pb-8 absolute lg:static bg-white lg:z-auto z-[-1] left-0 w-full lg:w-auto lg:pl-0 pl-7 transition-all duration-500 ease-in ${
              open ? "top-16 opacity-100" : "top-[-490px] opacity-0"
            } lg:opacity-100`}
          >
            {links.map((link) => (
              <li className="lg:ml-4 text-base lg:my-0 my-5" key={link.name}>
                <NavLink
                  onClick={handleNavClose}
                  className="text-gray px-3 py-2 rounded-md hover:text-rose-500 duration-500"
                  to={link.link}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            {user && (
              <li className="lg:ml-4 text-base lg:my-0 my-5">
                <NavLink
                  onClick={handleNavClose}
                  className="text-gray px-3 py-2 rounded-md hover:text-rose-500 duration-500"
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            {user && (
              <li className="lg:ml-4 text-base lg:my-0">
                <Link onClick={handleNavClose} to="#">
                  <div className="avatar">
                    {user.photoURL ? (
                      <img src={`${user.photoURL}`} />
                    ) : (
                      <div className="w-12 pt-2">
                        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <svg
                            className="absolute w-12 h-12 text-gray-400 -left-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            )}
            {user ? (
              <li className="lg:ml-4 text-base lg:my-0 my-5">
                <Link
                  onClick={handleSignOut}
                  className="text-gray px-3 py-2 rounded-md hover:text-rose-500 duration-500"
                  to="/login"
                >
                  Sign Out
                </Link>
              </li>
            ) : (
              <li className="lg:ml-4 text-base lg:my-0 my-5">
                <NavLink
                  onClick={handleNavClose}
                  className="text-gray px-3 py-2 rounded-md hover:text-rose-500 duration-500"
                  to="/login"
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
