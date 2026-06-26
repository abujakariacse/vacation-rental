import { signOut } from "firebase/auth";
import React, { useEffect, useLayoutEffect, useRef, useState, Fragment } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import auth from "../../firebase.init";
import Loader from "./Loader";
// Headless UI
import { Menu, Transition } from "@headlessui/react";
import AskQuestionIcon from "./NavIcons/ask-question-icon";
import LogoutIcon from "./NavIcons/logout-icon";
import UseProfilePhoto from "../../hooks/useProfilePhoto";

const Navbar = () => {
  let [open, setOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const topBarRef = useRef(null);
  const navRef = useRef(null);
  // Give a safe initial height so pages don't render behind nav before measurement.
  const [navHeight, setNavHeight] = useState(80);
  const [topOffset, setTopOffset] = useState(0);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const shownImage = UseProfilePhoto();
  const handleSignOut = () => {
    signOut(auth);
    navigate("/login");
  };
  const handleNavClose = () => {
    setOpen(false);
  };
  let links = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Rooms", link: "/rooms" },
    { name: "Blogs", link: "/blogs" },
    { name: "Contact", link: "/contact" },
  ];

  const isRoomSection = pathname.startsWith("/rooms") || pathname.startsWith("/roomDetail");
  const isBlogSection = pathname.startsWith("/blogs") || pathname.startsWith("/blogDetail");

  // Auto-close mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Measure heights used for fixed nav behavior
  useLayoutEffect(() => {
    const measure = () => {
      const measuredNavHeight = navRef.current?.offsetHeight || 0;
      if (measuredNavHeight > 0) setNavHeight(measuredNavHeight);
      const topBarHeight = topBarRef.current?.offsetHeight || 0;
      // when at top, nav sits right below top bar (desktop)
      setTopOffset(topBarHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Keep nav fixed; slide its top from topBarHeight -> 0 as you scroll
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const topBarHeight = topBarRef.current?.offsetHeight || 0;
        const next = Math.max(topBarHeight - window.scrollY, 0);
        setTopOffset(next);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="font-[Poppins]">
      <div ref={topBarRef} className="bg-rose-500 lg:flex justify-around py-2 hidden">
        <div>
          <h3 className="text-white font-[poppins] text-sm">
            Phone: +8801316460386 or Email: contact@vacationrental.com
          </h3>
        </div>
        <div>
          <a href="https://facebook.com/vacation-rental" target="_blank" rel="noreferrer">
            <i className="text-white mr-4 fa-brands fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com/vacation-rental" target="_blank" rel="noreferrer">
            <i className="text-white mr-4 fa-brands fa-twitter"></i>
          </a>
          <a href="https://instagram.com/vacation-rental" target="_blank" rel="noreferrer">
            <i className="text-white mr-4 fa-brands fa-instagram"></i>
          </a>
          <a href="https://dribble.com/vacationrental" target="_blank" rel="noreferrer">
            <i className="text-white mr-4 fa-brands fa-dribbble"></i>
          </a>
        </div>
      </div>
      {/* Permanent spacer prevents layout jump */}
      <div style={{ height: navHeight, minHeight: 72 }} />

      <div
        ref={navRef}
        className="site-nav fixed left-0 right-0 z-50 w-full bg-base-100/70 backdrop-blur-xl shadow-md border-b border-base-200/60"
        style={{ top: topOffset }}
      >
        <div className="relative flex items-center justify-between py-4 px-4 sm:px-7 mx-4 sm:mx-8 lg:mx-14">
          <div className="font-bold cursor-pointer text-xl">
            <Link to="/" className="text-2xl font-[poppins]">
              Vacation<span className="text-rose-500">Rental</span>
            </Link>
          </div>
          <div onClick={() => setOpen(!open)} className="text-3xl cursor-pointer lg:hidden">
            <i className={`${open ? "fa-solid fa-x" : "fa-solid fa-bars"}`}></i>
          </div>

          {/* Desktop menu */}
          <ul className="hidden lg:flex lg:items-center lg:pb-0">
            {links.map((link) => (
              <li className="lg:ml-4 text-base lg:my-0 my-5" key={link.name}>
                <NavLink
                  onClick={handleNavClose}
                  className={({ isActive }) => {
                    const active =
                      isActive ||
                      (link.link === "/rooms" && isRoomSection) ||
                      (link.link === "/blogs" && isBlogSection);
                    return `text-gray px-3 py-2 rounded-md hover:text-rose-500 duration-500 ${
                      active ? "active" : ""
                    }`;
                  }}
                  to={link.link}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            {user ? (
              <li className="lg:ml-4 text-base lg:my-0">
                <Link onClick={handleNavClose} to="#">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-base-content focus:outline-none">
                        <div className="w-12 h-12 border border-red-500 rounded-full overflow-hidden">
                          <img
                            className="w-full h-full object-contain object-center"
                            src={shownImage}
                            alt=""
                          />
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
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-xl bg-base-100 border border-base-200/70 focus:outline-none z-50 overflow-hidden">
                        <>
                          {" "}
                          <div className="text-center my-2">
                            <div className="bg-gradient-to-r inline-block from-cyan-500 to-blue-500 p-0.5 rounded-full">
                              <div className="bg-base-100 p-0.5 inline-block rounded-full">
                                <img
                                  src={shownImage}
                                  alt={"username"}
                                  className="w-10 h-10 border border-red-500 rounded-full object-cover inline-block object-center cursor-pointer mx-auto"
                                />
                              </div>
                            </div>
                            <p className="text-lg font-medium mt-2">{user?.displayName}</p>
                            <Link
                              to="/profile"
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
                                to="/dashboard"
                                className="py-3 px-4 w-full flex hover:bg-base-200/60 text-base-content items-center space-x-2"
                              >
                                <i className="fa-solid fa-gauge-high w-5 text-center opacity-80 text-lg"></i>
                                <span className="text-sm">Dashboard</span>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {() => (
                              <Link
                                prefetch="intent"
                                to="/question/create"
                                className="py-3 px-4 w-full flex hover:bg-base-200/60 text-base-content items-center space-x-2"
                              >
                                <AskQuestionIcon />
                                <span className="text-sm">Ask Question</span>
                              </Link>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {() => (
                              <Link
                                onClick={handleSignOut}
                                className="py-3 px-4 w-full flex hover:bg-base-200/60 text-base-content items-center space-x-2"
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

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
            open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-base-100/80 backdrop-blur-xl border-t border-base-200/60">
            <div className="px-7 mx-14 py-4">
              <nav className="grid gap-1">
                {links.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.link}
                    className={({ isActive }) => {
                      const active =
                        isActive ||
                        (link.link === "/room" && isRoomSection) ||
                        (link.link === "/blogs" && isBlogSection);
                      return `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        active ? "bg-rose-500/10 text-rose-600" : "text-neutral hover:bg-black/5"
                      }`;
                    }}
                    onClick={handleNavClose}
                  >
                    <span>{link.name}</span>
                    <i className="fa-solid fa-angle-right text-xs opacity-60"></i>
                  </NavLink>
                ))}

                <div className="h-px bg-black/10 my-2"></div>

                {user ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-neutral hover:bg-black/5 transition"
                      onClick={handleNavClose}
                    >
                      <span>Dashboard</span>
                      <i className="fa-solid fa-angle-right text-xs opacity-60"></i>
                    </NavLink>

                    <NavLink
                      to="/profile"
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-neutral hover:bg-black/5 transition"
                      onClick={handleNavClose}
                    >
                      <span>Profile</span>
                      <i className="fa-solid fa-angle-right text-xs opacity-60"></i>
                    </NavLink>

                    <button
                      type="button"
                      onClick={() => {
                        handleNavClose();
                        handleSignOut();
                      }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-500/10 transition text-left"
                    >
                      <span>Logout</span>
                      <i className="fa-solid fa-arrow-right-from-bracket text-xs opacity-70"></i>
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-neutral hover:bg-black/5 transition"
                    onClick={handleNavClose}
                  >
                    <span>Login</span>
                    <i className="fa-solid fa-angle-right text-xs opacity-60"></i>
                  </NavLink>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
