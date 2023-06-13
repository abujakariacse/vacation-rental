import React from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";
import auth from "../../firebase.init";
import Loader from "../Shared/Loader";
import useProfilePhoto from "../../hooks/useProfilePhoto";
const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const shownImage = useProfilePhoto();
  const [show, setShow] = useState(false);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="bg-accent relative min-h-screen flex font-[Poppins]">
      <div>
        <div
          className={`z-50 absolute ${
            show
              ? "left-0 transition-all duration-500"
              : "left-[-180px] transition-all duration-500"
          } min-h-screen`}
        >
          <nav className="flex flex-col bg-primary w-52 h-screen px-4 tex-gray-900 rounded-sm">
            <div className="flex flex-wrap mt-8">
              <div className="w-1/2">
                <img
                  src={shownImage}
                  className="mx-auto w-14 h-14 rounded-full"
                  alt=""
                />
              </div>
              <div className="w-1/2 mt-2">
                <span className="font-semibold text-white">
                  {user?.displayName.split(" ")[0]}
                </span>
                <small className="text-white block">User</small>
              </div>
            </div>
            <div className="mt-10 mb-4">
              <ul className="ml-4 dashboard-navlink">
                <Link to="/dashboard">
                  <li className="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-white  hover:font-bold rounded">
                    <span>
                      <i className="fa-solid fa-bag-shopping"></i>
                    </span>

                    <span className="ml-2">My Bookings</span>
                  </li>
                </Link>
                <Link to="/dashboard/cart">
                  <li className="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-white  hover:font-bold rounded">
                    <span>
                      <i className="fa-solid fa-cart-plus"></i>
                    </span>
                    <span className="ml-2">My Cart</span>
                  </li>
                </Link>
                <Link to="/dashboard/addreview">
                  <li className="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-white  hover:font-bold rounded">
                    <span>
                      <i className="fa-solid fa-star-half-stroke"></i>
                    </span>
                    <span className="ml-2">Rate Us</span>
                  </li>
                </Link>
                <Link to="/dashboard/allbookings">
                  <li className="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-white  hover:font-bold rounded">
                    <span>
                      <i className="fa-solid fa-align-justify"></i>
                    </span>
                    <span className="ml-2">Bookings</span>
                  </li>
                </Link>
                <Link to="/dashboard/customers">
                  <li className="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-white  hover:font-bold rounded">
                    <span>
                      <i className="fa-solid fa-users"></i>
                    </span>
                    <span className="ml-2">Customers</span>
                  </li>
                </Link>
                <Link to="/dashboard/rooms">
                  <li className="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-white  hover:font-bold rounded">
                    <span>
                      <i className="fa-solid fa-bars-progress"></i>
                    </span>
                    <span className="ml-2">Rooms</span>
                  </li>
                </Link>
                <Link to="/dashboard/addblog">
                  <li className="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-white  hover:font-bold rounded">
                    <span>
                      <i className="fa-brands fa-blogger"></i>
                    </span>
                    <span className="ml-2">Add Blog</span>
                  </li>
                </Link>
                <Link to="/dashboard/team">
                  <li className="mb-2 px-4 py-4 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-white  hover:font-bold rounded">
                    <span>
                      <i className="fa-solid fa-people-group"></i>
                    </span>
                    <span className="ml-2">Team</span>
                  </li>
                </Link>
              </ul>
            </div>
          </nav>
          <div className="absolute top-20 left-44">
            <span
              onClick={() => setShow(!show)}
              className="btn bg-white hover:bg-white
                    border border-primary outline-none rounded-full w-12 h-12 "
            >
              <i
                className={`fa-solid ${
                  show ? "fa-angle-left" : "fa-angle-right"
                }
                    text-xl text-black transition-all duration-700`}
              ></i>
            </span>
          </div>
        </div>
      </div>
      <div className="mx-16 w-full lg:mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
