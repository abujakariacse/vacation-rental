import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useRooms from "../../hooks/useRooms";
import { ENDPOINT } from "../../config/env";
import { isValidBangladeshiPhone, normalizeBDPhone } from "../../utils/validation";

const AdminBookRoom = () => {
  const navigate = useNavigate();
  const [rooms, roomsLoading] = useRooms();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adult, setAdult] = useState("1");
  const [child, setChild] = useState("0");
  const [quantity, setQuantity] = useState("1");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Approved");
  const [payment, setPayment] = useState("Paid");

  const today = new Date();
  const minCheckInDate = new Date(today.toLocaleDateString());

  // Prevent invalid dates
  useEffect(() => {
    if (!checkIn || !checkOut) return;
    if (checkOut < checkIn) {
      setCheckOut(null);
    }
  }, [checkIn, checkOut]);

  const targetRoom = rooms?.find((r) => r._id === roomId);

  // Cost calculation
  const totalDays = checkIn && checkOut 
    ? Math.max(1, Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24)))
    : 0;
  
  const perNight = Number(targetRoom?.rentFee || 0);
  const qty = Number(quantity);
  const baseTotal = perNight * qty;
  const rentCost = totalDays > 0 ? perNight * totalDays * qty : baseTotal;
  const serviceFee = rentCost > 0 ? Math.round(rentCost * 0.06) : 0;
  const grandTotal = rentCost + serviceFee;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userEmail || !userName || !phone || !roomId || !checkIn || !checkOut || !time) {
      return Swal.fire({
        icon: "error",
        title: "Incomplete form",
        text: "Please fill in all required fields.",
      });
    }

    if (!isValidBangladeshiPhone(phone)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid phone",
        text: "Please enter a valid Bangladeshi phone number.",
      });
    }

    if (checkOut < checkIn) {
      return Swal.fire({
        icon: "error",
        title: "Invalid dates",
        text: "Check-out date cannot be earlier than check-in date.",
      });
    }

    const bookingPayload = {
      userName,
      email: userEmail.toLowerCase().trim(),
      phone: normalizeBDPhone(phone),
      roomName: targetRoom?.name,
      roomId,
      quantity,
      adult,
      child,
      checkIn: checkIn.toString(),
      checkOut: checkOut.toString(),
      totalDays,
      time,
      perDayCost: targetRoom?.rentFee,
      rentCost,
      nid: "", // NID omitted for admin booking
      status,
      payment,
      bookedByAdmin: true,
    };

    setSubmitting(true);
    fetch(`${ENDPOINT}/bookOne`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          toast.success("Booking created successfully!");
          navigate("/dashboard/allbookings");
        } else {
          toast.error("Failed to create booking");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("An error occurred");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="font-[Poppins] text-sm max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Create Booking</h2>
          <p className="text-sm text-neutral/60 mt-2">
            Manually create a room reservation for any user.
          </p>
        </div>
        <Link to="/dashboard/allbookings" className="btn btn-outline btn-sm">
          Cancel & Back
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* User Details */}
            <div>
              <h3 className="text-lg font-semibold text-neutral border-b border-base-200/60 pb-2">Guest Details</h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs font-semibold text-neutral/70">User Email *</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="input input-bordered w-full bg-white/60 mt-2"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral/70">Guest Full Name *</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="John Doe"
                    className="input input-bordered w-full bg-white/60 mt-2"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral/70">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="input input-bordered w-full bg-white/60 mt-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div>
              <h3 className="text-lg font-semibold text-neutral border-b border-base-200/60 pb-2">Room & Dates</h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral/70">Select Room *</label>
                  <select
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="select select-bordered w-full bg-white/60 mt-2"
                    required
                  >
                    <option value="" disabled>Select a room</option>
                    {roomsLoading && <option disabled>Loading rooms...</option>}
                    {rooms?.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name} - ${r.rentFee} / night
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral/70">Check-in *</label>
                  <DatePicker
                    minDate={minCheckInDate}
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    dateFormatCalendar="pp"
                    autoComplete="off"
                    className="input input-bordered w-full bg-white/60 mt-2"
                    placeholderText="Select date"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral/70">Check-out *</label>
                  <DatePicker
                    minDate={checkIn || minCheckInDate}
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    dateFormatCalendar="pp"
                    autoComplete="off"
                    className="input input-bordered w-full bg-white/60 mt-2"
                    placeholderText="Select date"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral/70">Expected Arrival Time *</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input input-bordered w-full bg-white/60 mt-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-neutral/70">Qty</label>
                    <select value={quantity} onChange={(e) => setQuantity(e.target.value)} className="select select-sm select-bordered w-full bg-white/60 mt-2">
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-neutral/70">Adults</label>
                    <select value={adult} onChange={(e) => setAdult(e.target.value)} className="select select-sm select-bordered w-full bg-white/60 mt-2">
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-neutral/70">Children</label>
                    <select value={child} onChange={(e) => setChild(e.target.value)} className="select select-sm select-bordered w-full bg-white/60 mt-2">
                      {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
              <h3 className="text-[15px] font-semibold text-primary mb-3"><i className="fa-solid fa-lock mr-2"></i>Admin Controls</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral/70">Booking Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="select select-bordered w-full bg-white/60 mt-2 border-primary/30">
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Checkout">Checkout</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral/70">Payment Status</label>
                  <select value={payment} onChange={(e) => setPayment(e.target.value)} className="select select-bordered w-full bg-white/60 mt-2 border-primary/30">
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary text-white w-full" disabled={submitting}>
              {submitting ? "Creating Booking..." : "Create Booking"}
            </button>
          </form>
        </div>

        {/* Cost Summary sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-sm rounded-2xl p-6">
            <p className="text-sm font-semibold text-neutral">Price Calculation</p>
            
            {roomId ? (
              <div className="mt-5 space-y-3 text-sm text-neutral/70">
                <div className="flex items-center justify-between gap-3">
                  <p>${perNight} × {totalDays > 0 ? `${totalDays} night(s)` : "1 night"} × {qty}</p>
                  <p className="font-semibold text-neutral">${rentCost}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p>Service fee (6%)</p>
                  <p className="font-semibold text-neutral">${serviceFee}</p>
                </div>
                <div className="divider my-2"></div>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-neutral">Total Calculated</p>
                  <p className="text-lg font-bold text-neutral">${grandTotal}</p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs flex gap-2 items-start">
                  <i className="fa-solid fa-circle-info mt-0.5"></i>
                  <p>This is the calculated price. The actual status stored will be <b>{payment}</b> and <b>{status}</b> based on your Admin Controls selection.</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs text-neutral/50">Select a room and dates to see the price calculation.</p>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default AdminBookRoom;
