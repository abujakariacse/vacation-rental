import React, { useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import auth from "../../firebase.init";
import { ENDPOINT } from "../../config/env";

const MyQuestions = () => {
  const [user, authLoading] = useAuthState(auth);
  const [expandedId, setExpandedId] = useState(null);

  const { data: questions = [], isLoading: loading } = useQuery(
    ["myQuestions", user?.email],
    () => fetch(`${ENDPOINT}/myquestions?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((d) => Array.isArray(d) ? d.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []),
    { enabled: !!user?.email }
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const stats = {
    total: questions.length,
    pending: questions.filter((q) => q.status === "pending").length,
    answered: questions.filter((q) => q.status === "answered").length,
  };

  return (
    <div className="font-[Poppins]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">My Questions</h2>
          <p className="text-sm text-neutral/60 mt-2">View your submitted questions and admin replies.</p>
        </div>
        <Link to="/question/create" className="btn btn-primary text-white shrink-0">
          <i className="fa-solid fa-plus mr-2"></i>Ask a Question
        </Link>
      </div>

      {/* Stats */}
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

      {/* Questions list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral/50 gap-4">
          <i className="fa-solid fa-circle-question text-5xl text-primary/30"></i>
          <p className="text-base font-medium">You haven't asked any questions yet.</p>
          <Link to="/question/create" className="btn btn-primary btn-sm text-white">
            Ask your first question
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => {
            const isExpanded = expandedId === q._id;
            return (
              <div
                key={q._id}
                className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 rounded-2xl shadow-sm overflow-hidden transition-all"
              >
                {/* Header — always visible */}
                <button
                  className="w-full text-left p-4 sm:p-5 flex items-start gap-4 hover:bg-base-200/20 transition"
                  onClick={() => setExpandedId(isExpanded ? null : q._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-neutral text-base">{q.title}</h3>
                      <span className={`badge badge-sm text-white shrink-0 ${q.status === "answered" ? "badge-success" : "badge-warning"}`}>
                        {q.status === "answered" ? "Answered" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral/50">
                      <span><i className="fa-solid fa-folder mr-1"></i>{q.category}</span>
                      <span>{q.createdAt ? new Date(q.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}</span>
                    </div>
                  </div>
                  <i className={`fa-solid fa-chevron-down text-neutral/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}></i>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-base-200/60">
                    {/* Tags */}
                    {q.tags?.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-3">
                        {q.tags.map((t, i) => (
                          <span key={i} className="badge badge-ghost badge-sm">{t}</span>
                        ))}
                      </div>
                    )}

                    {/* Question details */}
                    <div className="mt-3 bg-base-200/30 p-4 rounded-xl border border-base-200/40">
                      <p className="text-xs font-semibold text-neutral/60 mb-1">Your Question</p>
                      <p className="text-sm text-neutral/80 whitespace-pre-wrap">{q.details}</p>
                    </div>

                    {/* Admin reply */}
                    {q.status === "answered" && q.reply ? (
                      <div className="mt-3 bg-success/5 p-4 rounded-xl border border-success/20">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="fa-solid fa-user-shield text-success text-xs"></i>
                          <p className="text-xs font-semibold text-success">Admin Reply</p>
                          {q.repliedAt && (
                            <span className="text-[10px] text-neutral/40 ml-auto">
                              {new Date(q.repliedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral/80 whitespace-pre-wrap">{q.reply}</p>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-2 text-sm text-warning/80 p-3 rounded-xl bg-warning/5 border border-warning/15">
                        <i className="fa-solid fa-clock"></i>
                        <span>Waiting for admin reply...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyQuestions;
