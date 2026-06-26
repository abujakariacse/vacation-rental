import React, { useState } from "react";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import auth from "../firebase.init";
import { ENDPOINT } from "../config/env";
import useDbUser from "../hooks/useDbUser";
import { slugify } from "../utils/slugify";

const Cart = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { data: dbUser } = useDbUser();
  const [targetRoom, setTargetRoom] = useState({});
  const [cart, setCart] = useState(null);
  const [number, setNumber] = useState(0);
  const [roomLoading, setRoomLoading] = useState(false);
  
  const [nidUrl, setNidUrl] = useState("");
  const [uploadingNid, setUploadingNid] = useState(false);

  const handleNidUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingNid(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        const res = await fetch(`${ENDPOINT}/upload-file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBase64: base64String }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || data.error || "Upload failed");
        
        setNidUrl(data.secure_url);
        toast.success("NID Document verified!");
      } catch (error) {
        console.error(error);
        toast.error("Error uploading NID: " + error.message);
      } finally {
        setUploadingNid(false);
      }
    };
  };

  useEffect(() => {
    const cartStringified = localStorage.getItem("cart");
    if (!cartStringified) {
      setCart(null);
      return;
    }
    try {
      const cartFromLS = JSON.parse(cartStringified);
      setCart(cartFromLS);
    } catch {
      setCart(null);
    }
  }, [number]);

  useEffect(() => {
    if (cart?.roomId) {
      setRoomLoading(true);
      fetch(`${ENDPOINT}/room/${cart?.roomId}`)
        .then((res) => res.json())
        .then((data) => setTargetRoom(data))
        .finally(() => setRoomLoading(false));
    }
  }, [cart?.roomId]);

  if (cart === null) {
    return (
      <div className="bg-accent min-h-screen font-[Poppins]">
      <div className="app-container py-12">
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-8 sm:p-10 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <i className="fa-solid fa-cart-shopping text-3xl"></i>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-6">Your cart is empty</h1>
            <p className="text-neutral/70 mt-2">
              Choose a room, select dates, and your booking will appear here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/room" className="btn btn-primary text-white">
                Browse rooms
              </Link>
              <Link to="/blogs" className="btn btn-outline">
                Read blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const { userName, phone, roomId, quantity, adult, child, checkIn, checkOut, totalDays, time } =
    cart;

  const perNight = Number(targetRoom?.rentFee || 0);
  const nights = Math.max(Number(totalDays || 0), 0);
  const qty = Math.max(Number(quantity || 1), 1);
  const baseTotal = perNight * qty;
  const rentTotal = nights > 0 ? perNight * nights * qty : baseTotal;
  const serviceFee = rentTotal > 0 ? Math.round(rentTotal * 0.06) : 0;
  const grandTotal = rentTotal + serviceFee;

  const hanleDeleteBooking = () => {
    localStorage.removeItem("cart");
    setNumber((prev) => prev + 1);
  };
  const handleProceedBooking = () => {
    if (dbUser?.isSuspended) {
      return Swal.fire({
        icon: "error",
        title: "Account Suspended",
        text: "Your account has been suspended. Please appeal or contact support to regain booking privileges.",
      });
    }

    const rentCost = rentTotal;
    const email = user?.email;
    const roomName = targetRoom?.name;
    const perDayCost = targetRoom?.rentFee;
    const booking = {
      userName,
      email,
      phone,
      roomName,
      roomId,
      quantity,
      adult,
      child,
      checkIn,
      checkOut,
      totalDays,
      time,
      perDayCost,
      rentCost,
      nid: nidUrl,
      status: "Pending",
      payment: "Unpaid",
    };
    fetch(`${ENDPOINT}/bookOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          toast.success("Booked successfully");
          localStorage.removeItem("cart");
          navigate("/dashboard");
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Something went wrong",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };
  return (
    <div className="bg-accent min-h-screen font-[Poppins]">
      <div className="app-container py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-neutral/60">Dashboard / Cart</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral">Booking summary</h1>
            <p className="text-neutral/70 mt-1">
              Review your booking details before proceeding.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={hanleDeleteBooking} className="btn btn-outline btn-sm">
              Clear cart
            </button>
            <button
              onClick={handleProceedBooking}
              className="btn btn-primary btn-sm text-white"
              disabled={roomLoading || !targetRoom?._id || !nidUrl || uploadingNid || dbUser?.isSuspended}
              title={dbUser?.isSuspended ? "Account suspended" : roomLoading ? "Loading room..." : !nidUrl ? "NID upload required" : undefined}
            >
              Proceed booking
            </button>
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-12 gap-6 items-start">
          {/* Left: booking + guest details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <p className="text-sm font-semibold text-neutral">Room</p>
                {roomLoading ? (
                  <div className="mt-4">
                    <div className="h-5 w-48 bg-base-200 rounded"></div>
                    <div className="mt-3 h-40 bg-base-200 rounded-xl"></div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-56 w-full rounded-xl overflow-hidden border border-white/60 bg-white/40">
                      {targetRoom?.image ? (
                        <img
                          src={targetRoom.image}
                          alt={targetRoom.name || "Room"}
                          className="w-full h-40 sm:h-36 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-40 sm:h-36 bg-base-200" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-bold text-neutral truncate">
                        {targetRoom?.name || "Selected room"}
                      </h2>
                      <p className="text-sm text-neutral/60 mt-1">
                        ${perNight} / night • Qty {qty}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="badge badge-outline">Adults: {adult}</span>
                        <span className="badge badge-outline">Children: {child}</span>
                        <span className="badge badge-outline">Phone: {phone}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link to={`/roomDetail/${targetRoom?.name ? slugify(targetRoom.name) : roomId}`} className="btn btn-outline btn-sm">
                          View room
                        </Link>
                        <Link to="/room" className="btn btn-ghost btn-sm">
                          Change room
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl">
              <div className="p-6 sm:p-8">
                <p className="text-sm font-semibold text-neutral">Dates</p>
                <div className="mt-4 grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-white/60 border border-white/60">
                    <p className="text-xs text-neutral/50">Check-in</p>
                    <p className="font-semibold text-neutral mt-1">{checkIn || "—"}</p>
                    <p className="text-xs text-neutral/50 mt-1">Time: {time || "—"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/60 border border-white/60">
                    <p className="text-xs text-neutral/50">Check-out</p>
                    <p className="font-semibold text-neutral mt-1">{checkOut || "—"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/60 border border-white/60">
                    <p className="text-xs text-neutral/50">Nights</p>
                    <p className="font-semibold text-neutral mt-1">{nights}</p>
                  </div>
                </div>
                <div className="mt-5 text-sm text-neutral/70">
                  <p>
                    <span className="font-semibold text-neutral">Guest name:</span> {userName}
                    {user?.email ? (
                      <>
                        <span className="mx-2 text-neutral/40">•</span>
                        <span className="font-semibold text-neutral">Email:</span> {user.email}
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>

            {/* NID Upload Boundary */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl mt-6">
              <div className="p-6 sm:p-8">
                <p className="text-sm font-semibold text-neutral">Identity Verification (NID)</p>
                <p className="text-xs text-neutral/60 mt-1 mb-4">
                  Please upload a clear copy of your National ID (Image or PDF) for security purposes to proceed with this booking.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="file-input file-input-bordered w-full max-w-xs"
                    onChange={handleNidUpload}
                    disabled={uploadingNid || !!nidUrl}
                  />
                  {uploadingNid && <span className="loading loading-spinner text-primary"></span>}
                  {nidUrl && <i className="fa-solid fa-circle-check text-success text-2xl"></i>}
                </div>
                {nidUrl && (
                  <p className="text-xs text-success mt-2 font-semibold">Document securely verified and attached to reservation.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: totals */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral">Price details</p>
                  <span className="badge badge-secondary text-white">Pending</span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-neutral/70">
                  <div className="flex items-center justify-between gap-3">
                    <p>
                      ${perNight} × {nights > 0 ? `${nights} night(s)` : "1 night"} × {qty}
                    </p>
                    <p className="font-semibold text-neutral">${rentTotal}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p>Service fee (6%)</p>
                    <p className="font-semibold text-neutral">${serviceFee}</p>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-neutral">Total</p>
                    <p className="text-lg font-bold text-neutral">${grandTotal}</p>
                  </div>
                </div>

                <button
                  onClick={handleProceedBooking}
                  className="btn btn-primary text-white w-full mt-6"
                  disabled={roomLoading || !targetRoom?._id || !nidUrl || uploadingNid || dbUser?.isSuspended}
                  title={dbUser?.isSuspended ? "Account suspended" : ""}
                >
                  {nidUrl ? "Proceed booking" : "Upload NID to Proceed"}
                </button>
                <button
                  onClick={hanleDeleteBooking}
                  className="btn btn-outline w-full mt-3"
                >
                  Remove from cart
                </button>

                <p className="text-xs text-neutral/60 mt-4">
                  By proceeding, your booking will be created as <b>Pending</b> with <b>Unpaid</b> payment status.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
