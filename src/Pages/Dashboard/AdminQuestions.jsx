import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { ENDPOINT } from "../../config/env";

const AdminQuestions = () => {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [replyModal, setReplyModal] = useState({ isOpen: false, question: null, reply: "" });
  const [replying, setReplying] = useState(false);

  const { data: rawQuestions = [], isLoading: loading, refetch: loadQuestions } = useQuery(
    "adminQuestions",
    () => fetch(`${ENDPOINT}/questions`).then((r) => r.json())
      .then((d) => Array.isArray(d) ? d.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []),
  );

  const questions = rawQuestions;

  const stats = useMemo(() => {
    const list = questions || [];
    return {
      total: list.length,
      pending: list.filter((q) => q.status === "pending").length,
      answered: list.filter((q) => q.status === "answered").length,
    };
  }, [questions]);

  const filtered = useMemo(() => {
    const list = questions || [];
    return list.filter((q) => {
      if (filterStatus !== "All" && q.status !== filterStatus.toLowerCase()) return false;
      const s = query.trim().toLowerCase();
      if (s) {
        const hay = `${q.title || ""} ${q.userEmail || ""} ${q.userName || ""} ${q.category || ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [questions, query, filterStatus]);

  const handleReply = async () => {
    if (!replyModal.reply.trim()) return toast.error("Reply cannot be empty.");
    setReplying(true);
    try {
      const res = await fetch(`${ENDPOINT}/question/reply/${replyModal.question._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyModal.reply.trim() }),
      });
      const result = await res.json();
      if (res.ok && result.modifiedCount === 1) {
        toast.success("Reply sent successfully!");
        setReplyModal({ isOpen: false, question: null, reply: "" });
        loadQuestions();
      } else {
        toast.error("Failed to send reply.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="font-[Poppins] text-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Questions</h2>
          <p className="text-sm text-neutral/60 mt-2">Review and respond to user questions.</p>
        </div>
        <div className="w-full sm:w-[320px]">
          <label className="text-xs font-semibold text-neutral/70">Search</label>
          <div className="mt-2 relative">
            <i className="fa-solid fa-magnifying-glass text-neutral/50 absolute left-4 top-1/2 -translate-y-1/2"></i>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title, user, category..."
              className="input w-full bg-base-100/70 border border-base-200/60 rounded-2xl pl-11"
            />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, tone: "bg-primary/10 text-primary border-primary/20" },
          { label: "Pending", value: stats.pending, tone: "bg-warning/10 text-warning border-warning/20" },
          { label: "Answered", value: stats.answered, tone: "bg-success/10 text-success border-success/20" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border shadow-sm p-4 sm:p-5 bg-base-100/60 backdrop-blur-xl ${s.tone}`}>
            <p className="text-xs font-semibold tracking-wider uppercase opacity-80">{s.label}</p>
            <p className="mt-2 text-3xl sm:text-4xl font-bold leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-4">
        {["All", "Pending", "Answered"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`btn btn-sm ${filterStatus === s ? "btn-primary text-white" : "btn-ghost"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto z-0 rounded-2xl border border-base-200 bg-base-100/50 backdrop-blur-xl">
        <table className="table w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Question</th>
              <th>Category</th>
              <th>Status</th>
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
              filtered.map((q) => (
                <tr key={q._id} className="hover:bg-base-200/30 transition">
                  <td>
                    <div className="font-medium text-neutral">{q.userName || "—"}</div>
                    <div className="text-xs text-neutral/60">{q.userEmail}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-neutral max-w-[250px] truncate">{q.title}</div>
                    <div className="text-xs text-neutral/50 max-w-[250px] truncate">{q.details}</div>
                  </td>
                  <td>
                    <span className="badge badge-outline badge-sm">{q.category}</span>
                  </td>
                  <td>
                    <span className={`badge badge-sm text-white ${q.status === "answered" ? "badge-success" : "badge-warning"}`}>
                      {q.status === "answered" ? "Answered" : "Pending"}
                    </span>
                  </td>
                  <td className="text-neutral/70 whitespace-nowrap text-sm">
                    {q.createdAt ? new Date(q.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-sm btn-ghost text-primary"
                      onClick={() => setReplyModal({ isOpen: true, question: q, reply: q.reply || "" })}
                    >
                      {q.status === "answered" ? "View / Edit" : "Reply"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-neutral/60">
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {replyModal.isOpen &&
        createPortal(
          <dialog className="modal modal-open z-[9999]">
            <div className="modal-box bg-base-100 relative max-w-2xl">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setReplyModal({ isOpen: false, question: null, reply: "" })}>
                ✕
              </button>
              <h3 className="font-bold text-lg text-neutral mb-1">
                <i className="fa-solid fa-reply mr-2 text-primary"></i>
                {replyModal.question?.status === "answered" ? "View / Edit Reply" : "Reply to Question"}
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="bg-base-200/30 p-4 rounded-xl border border-base-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-neutral">{replyModal.question?.userName || "User"}</span>
                    <span className="text-xs text-neutral/50">
                      {replyModal.question?.createdAt ? new Date(replyModal.question.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="font-bold text-neutral">{replyModal.question?.title}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="badge badge-outline badge-sm">{replyModal.question?.category}</span>
                    {replyModal.question?.tags?.map((t, i) => (
                      <span key={i} className="badge badge-ghost badge-sm">{t}</span>
                    ))}
                  </div>
                  <p className="mt-3 text-neutral/70 whitespace-pre-wrap">{replyModal.question?.details}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral/70">Your Reply</label>
                  <textarea
                    className="textarea textarea-bordered w-full mt-2 min-h-[120px]"
                    placeholder="Type your reply here..."
                    value={replyModal.reply}
                    onChange={(e) => setReplyModal({ ...replyModal, reply: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="modal-action mt-4">
                <button className="btn btn-outline" onClick={() => setReplyModal({ isOpen: false, question: null, reply: "" })}>
                  Cancel
                </button>
                <button className="btn btn-primary text-white" disabled={replying || !replyModal.reply.trim()} onClick={handleReply}>
                  {replying ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
            <div className="modal-backdrop bg-black/20" onClick={() => setReplyModal({ isOpen: false, question: null, reply: "" })}></div>
          </dialog>,
          document.body
        )}
    </div>
  );
};

export default AdminQuestions;
