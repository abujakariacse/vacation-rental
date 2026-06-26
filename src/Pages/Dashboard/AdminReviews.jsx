import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { ENDPOINT } from "../../config/env";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterVis, setFilterVis] = useState("All");

  const loadReviews = () => {
    setLoading(true);
    fetch(`${ENDPOINT}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadReviews(); }, []);

  const stats = useMemo(() => {
    return {
      total: reviews.length,
      visible: reviews.filter((r) => r.showOnHomepage).length,
      hidden: reviews.filter((r) => !r.showOnHomepage).length,
    };
  }, [reviews]);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (filterVis === "Visible" && !r.showOnHomepage) return false;
      if (filterVis === "Hidden" && r.showOnHomepage) return false;
      const s = query.trim().toLowerCase();
      if (s) {
        const hay = `${r.name || ""} ${r.title || ""} ${r.comment || ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [reviews, query, filterVis]);

  const handleToggle = async (review) => {
    const newVal = !review.showOnHomepage;
    try {
      const res = await fetch(`${ENDPOINT}/review/toggle/${review._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnHomepage: newVal }),
      });
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r._id === review._id ? { ...r, showOnHomepage: newVal } : r)));
        toast.success(newVal ? "Review visible on homepage" : "Review hidden from homepage");
      }
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleDelete = (review) => {
    Swal.fire({
      title: "Delete this review?",
      text: `By "${review.name || "User"}"`,
      icon: "warning",
      showConfirmButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      showDenyButton: true,
      denyButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${ENDPOINT}/review/${review._id}`, { method: "DELETE" });
          setReviews((prev) => prev.filter((r) => r._id !== review._id));
          toast.success("Review deleted.");
        } catch {
          toast.error("Failed to delete.");
        }
      }
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa-solid fa-star text-xs ${i < rating ? "text-orange-400" : "text-base-300"}`}></i>
    ));
  };

  return (
    <div className="font-[Poppins] text-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Reviews</h2>
          <p className="text-sm text-neutral/60 mt-2">Manage which reviews appear on the homepage.</p>
        </div>
        <div className="w-full sm:w-[320px]">
          <label className="text-xs font-semibold text-neutral/70">Search</label>
          <div className="mt-2 relative">
            <i className="fa-solid fa-magnifying-glass text-neutral/50 absolute left-4 top-1/2 -translate-y-1/2"></i>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, title, comment..."
              className="input w-full bg-base-100/70 border border-base-200/60 rounded-2xl pl-11"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, tone: "bg-primary/10 text-primary border-primary/20" },
          { label: "On Homepage", value: stats.visible, tone: "bg-success/10 text-success border-success/20" },
          { label: "Hidden", value: stats.hidden, tone: "bg-warning/10 text-warning border-warning/20" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border shadow-sm p-4 sm:p-5 bg-base-100/60 backdrop-blur-xl ${s.tone}`}>
            <p className="text-xs font-semibold tracking-wider uppercase opacity-80">{s.label}</p>
            <p className="mt-2 text-3xl sm:text-4xl font-bold leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-4">
        {["All", "Visible", "Hidden"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterVis(s)}
            className={`btn btn-sm ${filterVis === s ? "btn-primary text-white" : "btn-ghost"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-base-200 bg-base-100/50 backdrop-blur-xl">
        <table className="table w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Homepage</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((r) => (
                <tr key={r._id} className="hover:bg-base-200/30 transition">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src={r.image || "https://i.ibb.co/XzGLjL6/user.png"} alt={r.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-neutral">{r.name || "—"}</div>
                        <div className="text-xs text-neutral/50">{r.title || ""}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-0.5">{renderStars(r.rating || 0)}</div>
                  </td>
                  <td>
                    <div className="max-w-[250px] truncate text-neutral/70">{r.comment || "—"}</div>
                  </td>
                  <td>
                    <label className="cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-sm toggle-success"
                        checked={!!r.showOnHomepage}
                        onChange={() => handleToggle(r)}
                      />
                      <span className="text-xs font-medium text-neutral/60">
                        {r.showOnHomepage ? "Visible" : "Hidden"}
                      </span>
                    </label>
                  </td>
                  <td className="text-neutral/70 whitespace-nowrap text-sm">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                      onClick={() => handleDelete(r)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-neutral/60">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviews;
