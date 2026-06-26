import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Parallax } from "react-parallax";
import BgImage from "../../images/banner.webp";
import useRooms from "../../hooks/useRooms";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../Shared/Loader.jsx";
import { isValidBangladeshiPhone, normalizeBDPhone } from "../../utils/validation";
// import Loader from '../Shared/Loader';

const Banner = () => {
  const [room, isLoading] = useRooms();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const today = new Date();
  const [minCheckInDate] = useState(new Date(today.toLocaleDateString()));
  const [maxCheckInDate] = useState(new Date(today.setDate(today.getDate() + 30)));

  // if checkIn date not available at first time this will work as default minTime. when checkin date will selected it will not work as min date
  const [minCheckOutDate] = useState(new Date(today.setDate(today.getDate() - 30)));

  const navigate = useNavigate();

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    if (checkOut < checkIn) {
      setCheckOut(null);
    }
  }, [checkIn, checkOut]);

  const handleSubmit = (e) => {
    e.preventDefault();
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

    const dateOne = new Date(checkIn);
    const dateTwo = new Date(checkOut);
    if (dateTwo < dateOne) {
      return Swal.fire({
        icon: "error",
        title: "Invalid dates",
        text: "Check-out date can't be earlier than check-in date.",
        confirmButtonColor: "#0D6EFD",
      });
    }
    const totalTime = Math.abs(dateTwo - dateOne);
    const days = Math.ceil(totalTime / (1000 * 60 * 60 * 24));

    if (
      checkIn === "" ||
      checkOut === "" ||
      room === "DEFAULT" ||
      quantity === "DEFAULT" ||
      adult === "DEFAULT" ||
      child === "DEFAULT" ||
      time === ""
    ) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Your booking form is incomplete",
        confirmButtonColor: "#0D6EFD",
      });
    }

    if (!isValidBangladeshiPhone(phone)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid phone number",
        text: "Use a Bangladeshi mobile number like 01XXXXXXXXX (or +8801XXXXXXXXX).",
        confirmButtonColor: "#0D6EFD",
      });
    }

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
    navigate("dashboard/cart");
  };

  return (
    <div>
      <div className="min-h-screen font-[Poppins]">
        <Parallax bgClassName="parallax-image" bgImage={BgImage} strength={400}>
          <div className="banner-gradient">
            <div className="min-h-screen font-serif">
              <div className="app-container min-h-screen grid lg:grid-cols-2 grid-cols-1 items-center gap-10">
                <div className="my-10 lg:my-0 mt-28 lg:mt-0">
                  <h4 className="text-white text-xl my-5">Welcome to Vacation Rental</h4>
                  <h1 className="lg:text-5xl text-3xl font-semibold my-5 text-white">
                    Rent an appartment
                  </h1>
                  <h1 className="lg:text-5xl text-3xl font-semibold text-white">
                    for your vacation
                  </h1>
                  <div className="mt-6 flex gap-4">
                    <Link to="/room">
                      <button className="bg-secondary px-3 text-white font-[poppins] py-2 rounded  hover:border border-primary hover:bg-transparent hover:text-primary duration-500">
                        Explore More
                      </button>
                    </Link>
                    <Link to="/contact">
                      <button className="bg-base-100 px-3 text-base-content font-[poppins] py-2 rounded hover:border border-base-100 hover:bg-transparent hover:text-base-100 duration-500">
                        Contact Us
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="card lg:w-96 mx-auto lg:mx-0 bg-base-100 shadow-xl rounded-md w-80 my-4 lg:my-0 min-h-fit justify-self-end">
                  <div className="card-body">
                    <h2 className="text-2xl">Book your apartment</h2>
                    <form onSubmit={handleSubmit} className="my-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="input w-full max-w-xs bg-accent placeholder:text-base-content/60 text-base my-2"
                        required
                      />

                      <div className="flex gap-5">
                        <DatePicker
                          minDate={minCheckInDate}
                          maxDate={maxCheckInDate}
                          selected={checkIn}
                          onChange={(date) => setCheckIn(date)}
                          name="checkIn"
                          dateFormatCalendar="pp"
                          autoComplete="off"
                          className="input w-full max-w-xs bg-accent placeholder:text-base-content/60"
                          placeholderText="Check-In"
                        />
                        <DatePicker
                          minDate={checkIn ? checkIn : minCheckOutDate}
                          name="checkOut"
                          selected={checkOut}
                          onChange={(date) => setCheckOut(date)}
                          dateFormatCalendar="pp"
                          autoComplete="off"
                          className="input w-full max-w-xs bg-accent placeholder:text-base-content/60"
                          placeholderText="Check-Out"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-5 my-4">
                        <select
                          defaultValue={"DEFAULT"}
                          name="adult"
                          className="select w-full max-w-xs bg-accent"
                        >
                          <option disabled value="DEFAULT">
                            Adults
                          </option>
                          <option className="option-text">1</option>
                          <option className="option-text">2</option>
                          <option className="option-text">3</option>
                          <option className="option-text">4</option>
                          <option className="option-text">5</option>
                        </select>
                        <select
                          defaultValue={"DEFAULT"}
                          name="child"
                          className="select w-full max-w-xs bg-accent"
                        >
                          <option disabled value="DEFAULT">
                            Children
                          </option>
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-5 my-4">
                        <select
                          defaultValue={"DEFAULT"}
                          name="room"
                          className="select w-full max-w-xs bg-accent"
                        >
                          <option disabled value="DEFAULT">
                            Rooms
                          </option>
                          {room?.map((r) => (
                            <option value={r._id} key={r._id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                        <select
                          defaultValue={"DEFAULT"}
                          name="quantity"
                          className="select w-full max-w-xs bg-accent"
                        >
                          <option disabled value="DEFAULT">
                            Quantity
                          </option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-5 my-2">
                        <input
                          autoComplete="off"
                          type="tel"
                          inputMode="tel"
                          name="phone"
                          placeholder="01XXXXXXXXX"
                          pattern="^(?:\\+?8801|8801|01)[3-9][0-9]{8}$"
                          onInvalid={(e) =>
                            e.target.setCustomValidity("Enter a valid Bangladeshi phone number")
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          className="input w-full max-w-xs bg-accent placeholder:text-base-content/60 text-base"
                          required
                        />
                        <input
                          type="time"
                          name="time"
                          placeholder="Select Time"
                          className="input w-full max-w-xs bg-accent placeholder:text-base-content/60 text-base"
                          required
                        />
                      </div>
                      <input
                        type="submit"
                        value="Book Apartment Now"
                        className="btn btn-secondary hover:bg-transparent hover:text-primary text-white font-normal w-full mt-5 rounded-sm"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Parallax>
      </div>
    </div>
  );
};

export default Banner;
