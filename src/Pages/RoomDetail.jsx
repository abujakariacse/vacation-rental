import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import WidthImg from "../images/icons/width.png";
import BedImg from "../images/icons/bed.png";
import InternetImg from "../images/icons/internet.png";
import Swal from "sweetalert2";
import Loader from "./Shared/Loader.jsx";
import { ENDPOINT } from "../config/env";
import { isValidBangladeshiPhone, normalizeBDPhone } from "../utils/validation";
import useDbUser from "../hooks/useDbUser";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";

const RenderStars = ({ avg }) => {
  const full = Math.floor(avg);
  const half = avg - full >= 0.25;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="inline-flex items-center gap-0.5 text-orange-400">
      {Array.from({ length: full }, (_, i) => <i key={`f${i}`} className="fa-solid fa-star"></i>)}
      {half && <i className="fa-solid fa-star-half-stroke"></i>}
      {Array.from({ length: empty }, (_, i) => <i key={`e${i}`} className="fa-regular fa-star"></i>)}
    </span>
  );
};

const RoomDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { data: roomDetail, isLoading } = useQuery(["roomDetail", slug], () =>
    fetch(`${ENDPOINT}/room/${slug}`).then((res) => res.json()),
  );
  const { data: dbUser } = useDbUser();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  // Set Calender Minimum Date
  const today = new Date();
  const [minCheckInDate] = useState(new Date(today.toLocaleDateString()));
  const [maxCheckInDate] = useState(new Date(today.setDate(today.getDate() + 30)));

  // if checkIn date not available at first time this will work as default minTime. when checkin date will selected it will not work as min date
  const [minCheckOutDate] = useState(new Date(today.setDate(today.getDate() - 30)));

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    if (checkOut < checkIn) {
      setCheckOut(null);
    }
  }, [checkIn, checkOut]);

  // Room rating data
  const [ratingSummary, setRatingSummary] = useState({ avg: 0, count: 0 });
  const [roomReviews, setRoomReviews] = useState([]);

  useEffect(() => {
    if (roomDetail?._id) {
      fetch(`${ENDPOINT}/room-rating-summary/${roomDetail._id}`)
        .then((r) => r.json())
        .then((d) => setRatingSummary(d))
        .catch(() => {});
      fetch(`${ENDPOINT}/room-ratings/${roomDetail._id}`)
        .then((r) => r.json())
        .then((d) => { if (Array.isArray(d)) setRoomReviews(d); })
        .catch(() => {});
    }
  }, [roomDetail]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      return Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "You must be logged in to book a room. Please sign in first.",
        confirmButtonText: "Go to Login",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }

    if (dbUser?.isSuspended) {
      return Swal.fire({
        icon: "error",
        title: "Account Suspended",
        text: "Your account has been suspended. Please appeal or contact support via email to regain booking privileges.",
      });
    }

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const userName = e.target.name.value;
    const checkIn = e.target.checkIn.value;
    const checkOut = e.target.checkOut.value;
    const adult = e.target.adult.value;
    const child = e.target.child.value;
    const roomId = e.target.room.value;
    const quantity = e.target.quantity.value;
    const phone = e.target.phone.value.trim();
    const time = e.target.time.value;

    if (
      checkIn === "" ||
      checkOut === "" ||
      quantity === "DEFAULT" ||
      adult === "DEFAULT" ||
      child === "DEFAULT" ||
      time === ""
    ) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Your booking form is incomplete",
      });
    }

    if (!isValidBangladeshiPhone(phone)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid phone number",
        text: "Use a Bangladeshi mobile number like 01XXXXXXXXX (or +8801XXXXXXXXX).",
      });
    }

    // To calculate the difference between checkIn and checkOut
    const dateOne = new Date(checkIn);
    const dateTwo = new Date(checkOut);
    if (dateTwo < dateOne) {
      return Swal.fire({
        icon: "error",
        title: "Invalid dates",
        text: "Check-out date can't be earlier than check-in date.",
      });
    }
    const totalTime = Math.abs(dateTwo - dateOne);
    const days = Math.ceil(totalTime / (1000 * 60 * 60 * 24));

    const booking = {
      userName,
      checkIn,
      checkOut,
      adult,
      child,
      roomId,
      quantity,
      phone: normalizeBDPhone(phone),
      time,
      totalDays: days,
    };
    // to test localstorage
    const stringifiedBooking = JSON.stringify(booking);
    localStorage.setItem("cart", stringifiedBooking);
    navigate("/dashboard/cart");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (roomDetail?.message === "Room not found" || (!isLoading && !roomDetail?._id)) {
    return (
      <div className="bg-accent min-h-[70vh] font-[Poppins] flex items-center justify-center py-12">
        <div className="text-center p-8 bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl max-w-md w-full mx-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <i className="fa-solid fa-bed text-3xl"></i>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral">Room not found</h2>
          <p className="mt-3 text-neutral/70">The room you are looking for doesn't exist or has been removed.</p>
          <Link to="/room" className="btn btn-primary text-white mt-6 w-full">
            Browse other rooms
          </Link>
        </div>
      </div>
    );
  }
  const { _id, name, image, rentFee, size, bed, view, max, detail } = roomDetail || {};

  const heroMeta = [
    { label: "Max guests", value: max || "—", icon: "fa-solid fa-people-group" },
    { label: "View", value: view || "—", icon: "fa-solid fa-mountain-sun" },
    { label: "Size", value: size || "—", icon: "fa-solid fa-ruler-combined" },
    { label: "Bed", value: bed ? `${bed} Queen` : "—", icon: "fa-solid fa-bed" },
  ];

  return (
    <div className="bg-accent font-[Poppins]">
      {/* Hero */}
      <div className="app-container pt-6">
        <nav className="text-sm text-neutral/70">
          <Link className="hover:text-primary" to="/">
            Home
          </Link>{" "}
          <span className="mx-2">/</span>
          <Link className="hover:text-primary" to="/room">
            Rooms
          </Link>{" "}
          <span className="mx-2">/</span>
          <span className="text-neutral/90">{name || "Details"}</span>
        </nav>

        <div className="mt-4 grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral leading-tight">
              {name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral/70">
              <span className="inline-flex items-center gap-2">
                <RenderStars avg={ratingSummary.avg} />
                <span className="ml-1 text-neutral/60">
                  {ratingSummary.avg > 0 ? ratingSummary.avg : "—"}
                  {ratingSummary.count > 0 && <span className="text-xs"> ({ratingSummary.count})</span>}
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="fa-solid fa-location-dot"></i>
                <span>VacationRental</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="fa-solid fa-tag"></i>
                <span className="font-semibold text-neutral">
                  ${rentFee} <span className="font-normal text-neutral/60">/ night</span>
                </span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-5">
              <p className="text-sm font-semibold text-neutral">Highlights</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-neutral/70">
                {heroMeta.slice(0, 4).map((m) => (
                  <div key={m.label} className="flex items-start gap-2">
                    <i className={`${m.icon} text-primary mt-[2px]`}></i>
                    <div>
                      <p className="text-xs text-neutral/50">{m.label}</p>
                      <p className="font-semibold text-neutral">{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl overflow-hidden border border-base-200/60 shadow-xl bg-base-100/40 backdrop-blur-xl">
          <img
            className="w-full h-[220px] sm:h-[320px] lg:h-[420px] object-cover"
            src={image}
            alt={name || "Room"}
            loading="lazy"
          />
        </div>
      </div>

      {/* Content */}
      <div className="app-container py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-neutral">Room details</h2>
              <p className="mt-3 text-neutral/70 leading-relaxed">{detail}</p>

              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-base-100/60 border border-base-200/60">
                  <img className="w-12" src={WidthImg} alt="" />
                  <div>
                    <p className="text-xs text-neutral/50">Size</p>
                    <p className="font-semibold text-neutral">
                      {size} {size?.slice?.(0, 2) ? `(${Number(size.slice(0, 2)) * 10} sq-ft)` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-base-100/60 border border-base-200/60">
                  <img className="w-12" src={BedImg} alt="" />
                  <div>
                    <p className="text-xs text-neutral/50">Bed</p>
                    <p className="font-semibold text-neutral">{bed} Queen-sized Bed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-base-100/60 border border-base-200/60">
                  <img className="w-12" src={InternetImg} alt="" />
                  <div>
                    <p className="text-xs text-neutral/50">Internet</p>
                    <p className="font-semibold text-neutral">Wi‑Fi included</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-neutral/70">
                <p>
                  <span className="font-semibold text-neutral">View:</span> {view}{" "}
                  <span className="mx-2 text-neutral/40">•</span>
                  <span className="font-semibold text-neutral">Capacity:</span> {max}
                </p>
              </div>
            </div>

            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-neutral">In-room amenities</h2>
              <div className="mt-5 grid md:grid-cols-3 gap-6 text-sm text-neutral/70">
                <div>
                  <p className="font-semibold text-neutral">For your comfort</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>{bed} Queen-sized bed</li>
                    <li>Executive writing table and stationery set</li>
                    <li>Walk-in wardrobe</li>
                    <li>Ensuite bathroom</li>
                    <li>Bathrobes, slippers and hairdryer</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-neutral">For your indulgence</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>LCD television with local and cable channels</li>
                    <li>Complimentary bottled water</li>
                    <li>Daily newspaper on request</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-neutral">For your convenience</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Wired and wireless Internet access</li>
                    <li>IDD telephone</li>
                    <li>Secure key-card access</li>
                    <li>Personal digital safe</li>
                    <li>24-hour in-room dining</li>
                    <li>Daily turn-down service available upon request</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/room" className="btn btn-outline">
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Back to rooms
              </Link>
              <Link to="/contact" className="btn btn-primary text-white">
                Ask about this room
              </Link>
            </div>
          </div>

          {/* Booking card */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-neutral/60">Price</p>
                    <p className="text-2xl font-bold text-neutral">
                      ${rentFee}{" "}
                      <span className="text-sm font-normal text-neutral/60">/ night</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-semibold border border-secondary/20 whitespace-nowrap shrink-0">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Instant booking
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral/70">Your name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full name"
                      className="input w-full bg-accent placeholder:text-base-content/60 mt-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral/70">Check-in</label>
                      <DatePicker
                        minDate={minCheckInDate}
                        maxDate={maxCheckInDate}
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date)}
                        name="checkIn"
                        dateFormatCalendar="pp"
                        autoComplete="off"
                        className="input w-full bg-accent placeholder:text-base-content/60 mt-2"
                        placeholderText="Select"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral/70">Check-out</label>
                      <DatePicker
                        minDate={checkIn ? checkIn : minCheckOutDate}
                        name="checkOut"
                        selected={checkOut}
                        onChange={(date) => setCheckOut(date)}
                        dateFormatCalendar="pp"
                        autoComplete="off"
                        className="input w-full bg-accent placeholder:text-base-content/60 mt-2"
                        placeholderText="Select"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral/70">Adults</label>
                      <select
                        defaultValue={"DEFAULT"}
                        name="adult"
                        className="select w-full bg-accent mt-2"
                      >
                        <option disabled value="DEFAULT">
                          Select
                        </option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral/70">Children</label>
                      <select
                        defaultValue={"DEFAULT"}
                        name="child"
                        className="select w-full bg-accent mt-2"
                      >
                        <option disabled value="DEFAULT">
                          Select
                        </option>
                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral/70">Room</label>
                      <select
                        disabled
                        defaultValue={"DEFAULT"}
                        name="room"
                        className="select w-full bg-accent mt-2"
                      >
                        <option value={_id}>{name}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral/70">Quantity</label>
                      <select
                        defaultValue={"DEFAULT"}
                        name="quantity"
                        className="select w-full bg-accent mt-2"
                      >
                        <option disabled value="DEFAULT">
                          Select
                        </option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral/70">Phone</label>
                      <input
                        autoComplete="off"
                        type="tel"
                        inputMode="tel"
                        name="phone"
                        placeholder="01XXXXXXXXX"
                        pattern="^(?:\\+?8801|8801|01)[3-9][0-9]{8}$"
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Enter a valid Bangladeshi phone number.")
                        }
                        onInput={(e) => e.target.setCustomValidity("")}
                        className="input w-full bg-accent placeholder:text-base-content/60 mt-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral/70">Time</label>
                      <input
                        type="time"
                        name="time"
                        className="input w-full bg-accent placeholder:text-base-content/60 mt-2"
                        required
                      />
                    </div>
                  </div>

                  <input
                    type="submit"
                    value="Book now"
                    disabled={dbUser?.isSuspended}
                    title={dbUser?.isSuspended ? "Account suspended" : ""}
                    className="btn btn-secondary hover:bg-transparent hover:text-primary text-white font-normal w-full rounded-sm"
                  />
                  <p className="text-xs text-neutral/60">
                    You won’t be charged yet. Your booking will be saved to your dashboard cart.
                  </p>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Room Reviews Section */}
      {roomReviews.length > 0 && (
        <div className="app-container pb-10">
          <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 mt-8">
            <h2 className="text-xl font-bold text-neutral flex items-center gap-2">
              <i className="fa-solid fa-comments text-primary"></i>
              Guest Reviews
              <span className="text-sm font-normal text-neutral/50">({roomReviews.length})</span>
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <RenderStars avg={ratingSummary.avg} />
              <span className="text-lg font-bold text-neutral">{ratingSummary.avg}</span>
              <span className="text-sm text-neutral/50">out of 5</span>
            </div>
            <div className="mt-6 space-y-4">
              {roomReviews.map((rv) => (
                <div key={rv._id} className="flex gap-4 p-4 rounded-xl bg-base-200/20 border border-base-200/40">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-sm">
                    {(rv.userName || rv.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-neutral text-sm">{rv.userName || "Guest"}</span>
                      <span className="text-xs text-neutral/40">
                        {rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <i key={i} className={`fa-solid fa-star text-xs ${i < rv.rating ? "text-orange-400" : "text-base-300"}`}></i>
                      ))}
                    </div>
                    {rv.comment && <p className="text-sm text-neutral/70 mt-1.5 leading-relaxed">{rv.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
