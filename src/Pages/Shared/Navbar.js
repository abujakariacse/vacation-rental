import { signOut } from "firebase/auth";
import React, { useState, Fragment } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";
import auth from "../../firebase.init";
import Loader from "./Loader";
// Headless UI
import { Menu, Transition } from "@headlessui/react";
import AskQuestionIcon from "./NavIcons/ask-question-icon";
import LogoutIcon from "./NavIcons/logout-icon";
import SettingIcon from "./NavIcons/setting-icon";
import UseProfilePhoto from "../../hooks/useProfilePhoto";

const Navbar = () => {
  let [open, setOpen] = useState(false);
  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();
  const shownImage = UseProfilePhoto();
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
            {user ? (
              <li className="lg:ml-4 text-base lg:my-0">
                <Link onClick={handleNavClose} to="#">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                        <div className="p-0.5 rounded-full">
                          <div className="avatar">
                            <img
                              width="20px"
                              height="20px"
                              src={`${shownImage}`}
                            />
                          </div>
                        </div>
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <>
                          {" "}
                          <div className="text-center my-2">
                            <div className="bg-gradient-to-r inline-block from-cyan-500 to-blue-500  p-0.5 rounded-full">
                              <div className="bg-white p-0.5 inline-block rounded-full">
                                <img
                                  src={shownImage}
                                  alt={"username"}
                                  className="h-20 w-20 rounded-full object-cover inline-block object-center cursor-pointer mx-auto"
                                />
                              </div>
                            </div>
                            <p className="text-lg font-medium mt-2">
                              {user?.displayName}
                            </p>
                            <Link
                              prefetch="intent"
                              to={`/user/${"username"}`}
                              className="px-4 py-2 bg-blue-500 shadow-blue-500/30 shadow-xl text-white inline-block text-sm rounded-full mt-2 mb-4"
                            >
                              View Profile
                            </Link>
                          </div>
                        </>
                        <div className="py-1">
                          <Menu.Item>
                            {() => (
                              <Link
                                prefetch="intent"
                                to="/question/create"
                                className="py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700 items-center space-x-2"
                              >
                                <AskQuestionIcon />
                                <span className="text-sm">Ask Question</span>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {() => (
                              <Link
                                prefetch="intent"
                                to="/setting"
                                className="py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700 items-center space-x-2"
                              >
                                <SettingIcon />
                                <span className="text-sm">Settings</span>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {() => (
                              <Link
                                onClick={handleSignOut}
                                className="py-3 px-4 w-full flex hover:bg-gray-100 text-slate-700 items-center space-x-2"
                                to="/login"
                              >
                                <LogoutIcon />
                                <span className="text-sm">Logout</span>
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
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
