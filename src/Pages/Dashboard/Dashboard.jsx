import React from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink, Outlet } from "react-router-dom";
import auth from "../../firebase.init";
import Loader from "../Shared/Loader.jsx";
import useProfilePhoto from "../../hooks/useProfilePhoto";
import useDbUser from "../../hooks/useDbUser";
const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const { data: dbUser, isLoading: dbUserLoading } = useDbUser();
  const shownImage = useProfilePhoto();
  const [show, setShow] = useState(false);
  if (loading || dbUserLoading) {
    return <Loader />;
  }
  const isAdmin = dbUser?.role === "admin";
  return (
    <div className="bg-accent min-h-screen font-[Poppins]">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center justify-between bg-base-100 rounded-xl shadow-sm border border-base-200 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <img src={shownImage} className="w-10 h-10 rounded-full object-cover" alt="" />
              <div className="min-w-0">
                <p className="font-semibold truncate">{user?.displayName || "User"}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="btn btn-primary btn-sm text-white"
            >
              Menu
            </button>
          </div>

          {/* Sidebar */}
          <aside
            className={`lg:col-span-3 ${show ? "block" : "hidden"} lg:block lg:sticky lg:top-24 self-start h-[calc(100vh-120px)]`}
          >
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
              <div className="p-5 border-b border-base-200/60">
                <div className="flex items-center gap-3">
                  <img
                    src={shownImage}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                    alt=""
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate text-neutral">{user?.displayName || "User"}</p>
                    <p className="text-sm text-neutral/60 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-3 flex-1 overflow-y-auto">
                {[
                  ...(!isAdmin ? [
                    { to: "/dashboard/mybookings", label: "My Bookings", icon: "fa-bag-shopping" },
                    { to: "/dashboard/cart", label: "My Cart", icon: "fa-cart-plus" },
                    { to: "/dashboard/myquestions", label: "My Questions", icon: "fa-circle-question" },
                    { to: "/dashboard/addreview", label: "Rate Us", icon: "fa-star-half-stroke" },
                  ] : []),
                  ...(isAdmin ? [
                    { to: "/dashboard/allbookings", label: "Bookings", icon: "fa-align-justify" },
                    { to: "/dashboard/customers", label: "Customers", icon: "fa-users" },
                    { to: "/dashboard/rooms", label: "Rooms", icon: "fa-bars-progress" },
                    { to: "/dashboard/reviews", label: "Reviews", icon: "fa-star" },
                    { to: "/dashboard/questions", label: "Questions", icon: "fa-circle-question" },
                    { to: "/dashboard/blogs", label: "Blogs", icon: "fa-newspaper" },
                    { to: "/dashboard/team", label: "Team", icon: "fa-people-group" },
                  ] : []),
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/dashboard/mybookings"}
                    onClick={() => setShow(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${isActive
                        ? "bg-primary text-white font-semibold shadow-sm"
                        : "text-neutral/80 hover:bg-base-200/60"
                      }`
                    }
                  >
                    <i className={`fa-solid ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-9">
            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 p-4 sm:p-6 min-h-[calc(100vh-120px)]">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
