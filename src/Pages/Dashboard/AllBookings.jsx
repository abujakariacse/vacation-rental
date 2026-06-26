import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import Booking from "./Booking";
import { ENDPOINT } from "../../config/env";

const AllBookings = () => {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDateType, setFilterDateType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const { data: rawBookings = [], isLoading: loading } = useQuery(
    "allBookings",
    () => fetch(`${ENDPOINT}/allbookings`).then((r) => r.json()),
  );

  const bookings = useMemo(() => {
    if (!Array.isArray(rawBookings)) return [];
    return [...rawBookings].sort((a, b) => {
      const timeA = a._id ? parseInt(a._id.substring(0, 8), 16) : 0;
      const timeB = b._id ? parseInt(b._id.substring(0, 8), 16) : 0;
      return timeB - timeA;
    });
  }, [rawBookings]);

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

  const isDateInRange = (dateStr, type) => {
    if(!filterDateFrom && !filterDateTo) return true;
    if(!dateStr) return false;

    let targetDate;
    if(type === 'bookingDate') {
      targetDate = new Date(dateStr);
    } else {
      targetDate = new Date(dateStr);
    }
    
    if (isNaN(targetDate.getTime())) return true; // Can't parse reliably
    
    const target = targetDate.getTime();
    
    // Parse midnight to strict midnight safely
    let from = filterDateFrom ? new Date(filterDateFrom).getTime() : -Infinity;
    let to = filterDateTo ? new Date(filterDateTo).getTime() + 86400000 : Infinity; // Includes entire end day ceiling
    
    return target >= from && target < to;
  };

  const filtered = useMemo(() => {
    const list = bookings || [];
    return list.filter((b) => {
      // 1. Status Filter
      if (filterStatus !== "All" && b.status !== filterStatus) return false;

      // 2. Date Range Filter
      if (filterDateType && (filterDateFrom || filterDateTo)) {
        let dateVal = "";
        if (filterDateType === "checkIn") dateVal = b.checkIn;
        else if (filterDateType === "checkOut") dateVal = b.checkOut;
        else if (filterDateType === "bookingDate") dateVal = b.time;
        
        if (!isDateInRange(dateVal, filterDateType)) return false;
      }

      // 3. Text Search
      const q = query.trim().toLowerCase();
      if (q) {
        const hay = `${b?.roomName || ""} ${b?.userName || ""} ${b?.email || ""} ${b?.phone || ""} ${b?.status || ""} ${b?.roomNumber || ""}`.toLowerCase();
        if(!hay.includes(q)) return false;
      }
      return true;
    });
  }, [bookings, query, filterStatus, filterDateType, filterDateFrom, filterDateTo]);

  return (
    <div className="font-[Poppins] text-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">All bookings</h2>
          <p className="text-sm text-neutral/60 mt-2">
            Manage booking status and payment across all users.
          </p>
        </div>

        <div className="w-full sm:w-[360px] flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-neutral/70">Search</label>
            <div className="mt-2 relative">
              <i className="fa-solid fa-magnifying-glass text-neutral/50 absolute left-4 top-1/2 -translate-y-1/2"></i>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Room, user, email..."
                className="input w-full bg-base-100/70 border border-base-200/60 rounded-2xl pl-11"
              />
            </div>
          </div>
          <Link to="/dashboard/admin-book-room" className="btn btn-primary text-white shadow-sm shrink-0 mb-[1px]">
            <i className="fa-solid fa-plus mr-2"></i>
            Create Booking
          </Link>
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

      {/* Advanced Filters */}
      <div className="bg-base-100/50 backdrop-blur-xl border border-base-200/60 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-neutral/70 ml-1">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select select-bordered select-sm w-full mt-1 bg-white/60">
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Checkout">Checkout</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral/70 ml-1">Filter By Date</label>
            <select value={filterDateType} onChange={e => setFilterDateType(e.target.value)} className="select select-bordered select-sm w-full mt-1 bg-white/60">
              <option value="">None</option>
              <option value="bookingDate">Booking Date</option>
              <option value="checkIn">Check In</option>
              <option value="checkOut">Check Out</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral/70 ml-1">From</label>
            <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} disabled={!filterDateType} className="input input-sm input-bordered w-full mt-1 bg-white/60" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral/70 ml-1">To</label>
            <div className="flex gap-2">
              <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} disabled={!filterDateType} className="input input-sm input-bordered w-full mt-1 bg-white/60" />
              <button 
                onClick={() => { setFilterStatus("All"); setFilterDateType(""); setFilterDateFrom(""); setFilterDateTo(""); setQuery(""); }} 
                className="btn btn-sm btn-outline mt-1 shrink-0 px-3"
                title="Reset Filters"
              >
                <i className="fa-solid fa-rotate-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto z-0 rounded-2xl border border-base-200 bg-base-100/50 backdrop-blur-xl">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Room</th>
              <th>User</th>
              <th>Booking Date</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Payment</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </td>
              </tr>
            ) : filtered?.length ? (
              filtered.map((booking) => <Booking booking={booking} key={booking._id} />)
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-neutral/60">
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

export default AllBookings;
