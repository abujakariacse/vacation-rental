import React, { useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";
import auth from "../../firebase.init";
import MyBooking from "./MyBooking";
import { ENDPOINT } from "../../config/env";

const MyBookings = () => {
  const [user, loading] = useAuthState(auth);
  const email = user?.email;
  const [query, setQuery] = useState("");

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery(
    ["myBookings", email],
    () => fetch(`${ENDPOINT}/mybookings?email=${encodeURIComponent(email)}`).then((r) => r.json()),
    { enabled: !!email }
  );
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral/50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const stats = useMemo(() => {
    const list = bookings || [];
    const by = (s) => list.filter((b) => b?.status === s).length;
    return {
      total: list.length,
      approved: by("Approved"),
      pending: by("Pending"),
      rejected: by("Rejected"),
      checkout: by("Checkout"),
    };
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = bookings || [];
    if (!q) return list;
    return list.filter((b) => {
      const hay = `${b?.roomName || ""} ${b?.checkIn || ""} ${b?.checkOut || ""} ${b?.status || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [bookings, query]);

  return (
    <div className="font-[Poppins]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">My bookings</h2>
          <p className="text-sm text-neutral/60 mt-2">
            Track your stays, status updates, and totals in one place.
          </p>
        </div>

        <div className="w-full sm:w-[320px]">
          <label className="text-xs font-semibold text-neutral/70">Search</label>
          <div className="mt-2 relative">
            <i className="fa-solid fa-magnifying-glass text-neutral/50 absolute left-4 top-1/2 -translate-y-1/2"></i>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Room, date, status..."
              className="input w-full bg-base-100/70 border border-base-200/60 rounded-2xl pl-11"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Bookings", value: stats.total, tone: "bg-primary/10 text-primary border-primary/20" },
          { label: "Approved", value: stats.approved, tone: "bg-success/10 text-success border-success/20" },
          { label: "Pending", value: stats.pending, tone: "bg-info/10 text-info border-info/20" },
          { label: "Rejected", value: stats.rejected, tone: "bg-error/10 text-error border-error/20" },
          { label: "Checkout", value: stats.checkout, tone: "bg-base-200/70 text-neutral border-base-200" },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border shadow-sm p-4 sm:p-5 bg-base-100/60 backdrop-blur-xl ${s.tone}`}
          >
            <p className="text-xs font-semibold tracking-wider uppercase opacity-80">{s.label}</p>
            <p className="mt-2 text-3xl sm:text-4xl font-bold leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="w-full overflow-x-auto z-0 rounded-2xl border border-base-200 bg-base-100/50 backdrop-blur-xl">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Room</th>
              <th>Check In</th>
              <th>Time</th>
              <th>Check Out</th>
              <th className="text-center">Days</th>
              <th className="text-center">Qty</th>
              <th className="text-center">Adult</th>
              <th className="text-center">Child</th>
              <th className="text-right">Per day</th>
              <th className="text-right">Total</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookingsLoading ? (
              <tr>
                <td colSpan={12} className="py-20 text-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </td>
              </tr>
            ) : filtered?.length ? (
              filtered.map((booking) => (
                <MyBooking
                  booking={booking}
                  key={booking._id}
                  onDeleted={(id) => setBookings((prev) => prev.filter((b) => b._id !== id))}
                  onUpdated={(updated) => setBookings((prev) => prev.map((b) => b._id === updated._id ? updated : b))}
                />
              ))
            ) : (
              <tr>
                <td colSpan={12} className="py-10 text-center text-neutral/60">
                  No bookings match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;
