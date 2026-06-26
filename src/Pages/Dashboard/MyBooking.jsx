import React, { useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { ENDPOINT } from "../../config/env";

const StatusBadge = ({ status }) => {
  const base = "badge badge-sm font-semibold";
  if (status === "Approved") return <span className={`${base} badge-success text-white`}>Approved</span>;
  if (status === "Pending") return <span className={`${base} badge-info text-white`}>Pending</span>;
  if (status === "Rejected") return <span className={`${base} badge-error text-white`}>Rejected</span>;
  if (status === "Checkout") return <span className={`${base} badge-neutral text-white`}>Checkout</span>;
  return <span className={`${base} badge-ghost`}>{status || "—"}</span>;
};

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const MyBooking = ({ booking, onDeleted, onUpdated }) => {
  const [user] = useAuthState(auth);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [editForm, setEditForm] = useState({
    checkIn: booking.checkIn || "",
    checkOut: booking.checkOut || "",
    adult: booking.adult || 1,
    child: booking.child || 0,
    quantity: booking.quantity || 1,
  });

  const {
    _id,
    roomName,
    checkIn,
    checkOut,
    time,
    totalDays,
    quantity,
    adult,
    child,
    perDayCost,
    rentCost,
    status,
  } = booking;

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const calculateDays = (startStr, endStr) => {
     if (!startStr || !endStr) return 1;
     const start = new Date(startStr);
     const end = new Date(endStr);
     if(start >= end) return 1;
     return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const handleSaveEdit = () => {
    setSaving(true);
    const newDays = calculateDays(editForm.checkIn, editForm.checkOut);
    const newRent = newDays * parseInt(perDayCost || 0) * parseInt(editForm.quantity || 1);
    const updatedData = {
      ...editForm,
      totalDays: newDays,
      rentCost: newRent
    };

    fetch(`${ENDPOINT}/booking/edit/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(data => {
        setSaving(false);
        setIsEditing(false);
        toast.success("Booking updated successfully");
        if(onUpdated) onUpdated({ ...booking, ...updatedData });
      })
      .catch(err => {
        console.error(err);
        setSaving(false);
        toast.error("Failed to update booking");
      });
  };

  const hanleDeleteBooking = (id) => {
    Swal.fire({
      title: "Delete this booking?",
      icon: "warning",
      showConfirmButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      showDenyButton: true,
      denyButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${ENDPOINT}/mybooking/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              toast.success("Deleted successfully");
              onDeleted?.(id);
            }
          });
      }
    });
  };

  return (
    <>
      <tr className="hover:bg-base-200/30 transition">
        <td className="font-semibold text-neutral">{roomName}</td>
        <td className="text-neutral/70 whitespace-nowrap">{fmtDate(checkIn)}</td>
        <td className="text-neutral/70 whitespace-nowrap">{fmtDate(time)}</td>
        <td className="text-neutral/70 whitespace-nowrap">{fmtDate(checkOut)}</td>
        <td className="text-center text-neutral/70">{totalDays}</td>
        <td className="text-center text-neutral/70">{quantity}</td>
        <td className="text-center text-neutral/70">{adult}</td>
        <td className="text-center text-neutral/70">{child}</td>
        <td className="text-right font-semibold text-neutral">${perDayCost}</td>
        <td className="text-right font-semibold text-neutral">${rentCost}</td>
        <td>
          <StatusBadge status={status} />
        </td>
        <td className="text-right">
          {status === "Checkout" ? (
            <div className="flex gap-1 justify-end items-center">
              <span className="inline-flex items-center gap-1 text-success font-semibold text-xs mr-1">
                <i className="fa-solid fa-circle-check"></i> Done
              </span>
              {!hasRated && (
                <button
                  type="button"
                  onClick={() => setShowRating(true)}
                  className="btn btn-ghost btn-xs text-orange-500 hover:bg-orange-50"
                  title="Rate this room"
                >
                  <i className="fa-solid fa-star mr-1"></i>Rate
                </button>
              )}
            </div>
          ) : status === "Approved" ? (
            <span className="inline-flex items-center gap-2 text-success font-semibold">
              <i className="fa-solid fa-circle-check"></i>
              Done
            </span>
          ) : (
            <div className="flex gap-1 justify-end">
              {status === "Pending" && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-ghost btn-sm text-primary hover:bg-primary/10"
                  aria-label="Edit booking"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
              )}
              <button
                type="button"
                onClick={() => hanleDeleteBooking(_id)}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                aria-label="Delete booking"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          )}
        </td>
      </tr>

      {/* Edit Modal */}
      {isEditing && createPortal(
        <dialog className="modal modal-open z-[9999]">
          <div className="modal-box bg-base-100 relative max-w-sm">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsEditing(false)}>✕</button>
            <h3 className="font-bold text-lg text-neutral mb-4"><i className="fa-solid fa-pen-to-square mr-2 text-primary"></i>Edit Booking</h3>
            
            <div className="grid gap-3 text-left">
              <div>
                <label className="text-xs font-semibold text-neutral/70">Check In</label>
                <input type="date" name="checkIn" value={editForm.checkIn} onChange={handleChange} className="input input-sm input-bordered w-full mt-1 bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral/70">Check Out</label>
                <input type="date" name="checkOut" value={editForm.checkOut} onChange={handleChange} className="input input-sm input-bordered w-full mt-1 bg-white" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-neutral/70">Rooms/Qty</label>
                  <input type="number" min="1" name="quantity" value={editForm.quantity} onChange={handleChange} className="input input-sm input-bordered w-full mt-1 bg-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral/70">Adults</label>
                  <input type="number" min="1" name="adult" value={editForm.adult} onChange={handleChange} className="input input-sm input-bordered w-full mt-1 bg-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral/70">Children</label>
                  <input type="number" min="0" name="child" value={editForm.child} onChange={handleChange} className="input input-sm input-bordered w-full mt-1 bg-white" />
                </div>
              </div>
            </div>

            <div className="modal-action mt-6">
              <button className="btn btn-outline btn-sm text-neutral" onClick={() => setIsEditing(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm text-white" disabled={saving} onClick={handleSaveEdit}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/20" onClick={() => setIsEditing(false)}></div>
        </dialog>,
        document.body
      )}

      {/* Rate Room Modal */}
      {showRating && createPortal(
        <dialog className="modal modal-open z-[9999]">
          <div className="modal-box bg-base-100 relative max-w-sm">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setShowRating(false)}>✕</button>
            <h3 className="font-bold text-lg text-neutral mb-1">
              <i className="fa-solid fa-star mr-2 text-orange-400"></i>Rate Room
            </h3>
            <p className="text-sm text-neutral/60 mb-4">{roomName}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral/70">Your Rating</label>
                <div className="rating rating-lg gap-1 mt-2 block">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <input
                      key={v}
                      type="radio"
                      name="room-rating"
                      className="mask mask-star-2 bg-orange-400"
                      checked={ratingVal === v}
                      onChange={() => setRatingVal(v)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral/70">Comment (optional)</label>
                <textarea
                  className="textarea textarea-bordered w-full mt-1 text-sm"
                  rows="3"
                  placeholder="How was your stay?"
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-action mt-4">
              <button className="btn btn-outline btn-sm" onClick={() => setShowRating(false)}>Cancel</button>
              <button
                className="btn btn-sm btn-primary text-white"
                disabled={ratingSubmitting}
                onClick={async () => {
                  setRatingSubmitting(true);
                  try {
                    const res = await fetch(`${ENDPOINT}/room-rating`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        roomId: booking.roomId || booking._id,
                        roomName,
                        email: user?.email || booking.email,
                        userName: user?.displayName || booking.userName || "",
                        rating: ratingVal,
                        comment: ratingComment,
                      }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      toast.success(data.updated ? "Rating updated!" : "Rating submitted!");
                      setShowRating(false);
                      setHasRated(true);
                    } else {
                      toast.error(data.error || "Failed to submit rating.");
                    }
                  } catch {
                    toast.error("Network error.");
                  } finally {
                    setRatingSubmitting(false);
                  }
                }}
              >
                {ratingSubmitting ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/20" onClick={() => setShowRating(false)}></div>
        </dialog>,
        document.body
      )}
    </>
  );
};

export default MyBooking;
