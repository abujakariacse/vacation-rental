import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import auth from "../firebase.init";
import { updateProfile } from "firebase/auth";
import Loader from "./Shared/Loader.jsx";
import useProfilePhoto from "../hooks/useProfilePhoto";
import { ENDPOINT, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../config/env";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const photo = useProfilePhoto();
  const [dbUser, setDbUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [myQuestions, setMyQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [expandedQId, setExpandedQId] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

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

        if (!res.ok) {
          throw new Error(
            data.error?.message || data.error || "Backend signed upload proxy failed",
          );
        }

        const imageUrl = data.secure_url;

        // Update Firebase Auth globally so the navbar and state react instantly
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: imageUrl });
        }

        // Sync Database records
        const dbRes = await fetch(`${ENDPOINT}/user/profile/${user.email}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoURL: imageUrl }),
        });

        if (!dbRes.ok) throw new Error("Failed to update profile picture in database");

        setDbUser((prev) => ({ ...prev, photoURL: imageUrl }));
        toast.success("Profile picture updated!");
      } catch (error) {
        console.error(error);
        toast.error("Error uploading picture: " + error.message);
      } finally {
        setUploading(false);
      }
    };
  };

  useEffect(() => {
    if (user?.email) {
      fetch(`${ENDPOINT}/user/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setDbUser(data);
          setFormData({
            name: data?.name || user.displayName || "",
            phone: data?.phone || user.phoneNumber || "",
          });
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  // Fetch user's questions
  useEffect(() => {
    if (user?.email) {
      setQuestionsLoading(true);
      fetch(`${ENDPOINT}/myquestions?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMyQuestions(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setQuestionsLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${ENDPOINT}/user/profile/${user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setDbUser((prev) => ({ ...prev, ...formData }));
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="min-h-[60vh] bg-accent font-[Poppins] flex items-center">
        <div className="w-full max-w-xl mx-auto px-4 text-center">
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-neutral">You're not signed in</h1>
            <p className="mt-2 text-neutral/70">Please log in to view your profile.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/login" className="btn btn-primary text-white">
                Go to Login
              </Link>
              <Link to="/" className="btn btn-outline">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const providerId = user?.providerData?.[0]?.providerId;
  const providerLabel =
    providerId === "google.com"
      ? "Google"
      : providerId === "facebook.com"
        ? "Facebook"
        : providerId === "github.com"
          ? "GitHub"
          : providerId || "Email";

  const providerIcon =
    providerId === "google.com"
      ? "fa-brands fa-google"
      : providerId === "facebook.com"
        ? "fa-brands fa-facebook"
        : providerId === "github.com"
          ? "fa-brands fa-github"
          : "fa-solid fa-envelope";

  return (
    <section className="min-h-[70vh] bg-accent font-[Poppins]">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ─── Profile Hero Card ─── */}
        <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-3xl overflow-hidden">
          {/* Gradient Banner */}
          <div className="h-32 sm:h-40 bg-gradient-to-br from-primary via-primary/80 to-secondary relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]"></div>
          </div>

          {/* Avatar + Name Section */}
          <div className="px-6 sm:px-8 pb-6 -mt-12 sm:-mt-14 relative">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-base-100 shadow-lg shrink-0 bg-base-100">
                <img
                  src={dbUser?.photoURL || photo}
                  alt={user?.displayName ? `${user.displayName} avatar` : "User avatar"}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-70"
                />
                {uploading ? (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="loading loading-spinner loading-md text-white"></span>
                  </div>
                ) : (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer">
                    <i className="fa-solid fa-camera text-white text-lg"></i>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Name + Meta */}
              <div className="flex-1 min-w-0 pb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral tracking-tight truncate">
                  {dbUser?.name || user?.displayName || "User"}
                </h1>
                <p className="text-sm text-neutral/60 mt-0.5 truncate bg-white inline-block p-2 rounded-xl font-medium  border border-neutral/20">
                  {user?.email}
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">
                    <i className={`${providerIcon} text-[10px]`}></i>
                    {providerLabel}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${dbUser?.role === "admin" ? "bg-secondary/10 text-secondary border-secondary/15" : "bg-base-200/60 text-neutral/70 border-base-200"}`}
                  >
                    <i
                      className={`fa-solid ${dbUser?.role === "admin" ? "fa-user-shield" : "fa-user"} text-[10px]`}
                    ></i>
                    {(dbUser?.role || "user").charAt(0).toUpperCase() +
                      (dbUser?.role || "user").slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${user.emailVerified ? "bg-success/10 text-success border-success/15" : "bg-warning/10 text-warning border-warning/15"}`}
                  >
                    <i
                      className={`fa-solid ${user.emailVerified ? "fa-circle-check" : "fa-triangle-exclamation"} text-[10px]`}
                    ></i>
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:pb-1 shrink-0">
                <Link to="/dashboard" className="btn btn-primary btn-sm text-white">
                  <i className="fa-solid fa-gauge-high mr-1.5"></i>Dashboard
                </Link>
                <Link to="/question/create" className="btn btn-ghost btn-sm">
                  <i className="fa-solid fa-circle-question mr-1.5"></i>Ask
                </Link>
              </div>
            </div>

            {/* Suspended Warning */}
            {dbUser?.isSuspended && (
              <div className="mt-5 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
                <i className="fa-solid fa-ban text-error mt-0.5"></i>
                <div>
                  <p className="font-bold text-error text-sm">Account Suspended</p>
                  <p className="text-sm text-error/80 mt-0.5">
                    {dbUser?.suspendReason || "No reason provided."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Content Grid ─── */}
        <div className="grid lg:grid-cols-12 gap-6 mt-6">
          {/* ─── Account Details ─── */}
          <div className="lg:col-span-7">
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral flex items-center gap-2">
                    <i className="fa-solid fa-id-card text-primary text-base"></i>
                    Account Details
                  </h2>
                  <p className="text-xs text-neutral/60 mt-0.5">Manage your personal information</p>
                </div>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn btn-sm btn-ghost text-primary px-3"
                  >
                    <i className="fa-solid fa-pen-to-square mr-1"></i> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          name: dbUser?.name || user?.displayName || "",
                          phone: dbUser?.phone || user?.phoneNumber || "",
                        });
                      }}
                      className="btn btn-sm btn-ghost text-neutral"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn btn-sm btn-primary text-white"
                    >
                      {saving ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span> Saving
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {[
                  {
                    icon: "fa-user",
                    label: "Full Name",
                    value: dbUser?.name || user?.displayName || "—",
                    editable: true,
                    field: "name",
                  },
                  {
                    icon: "fa-envelope",
                    label: "Email Address",
                    value: user?.email,
                    editable: false,
                  },
                  {
                    icon: "fa-phone",
                    label: "Phone",
                    value: dbUser?.phone || user?.phoneNumber || "—",
                    editable: true,
                    field: "phone",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-base-200/25 border border-base-200/40 hover:bg-base-200/40 transition"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <i className={`fa-solid ${item.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-neutral/50 uppercase tracking-wider">
                        {item.label}
                      </p>
                      {editMode && item.editable ? (
                        <input
                          type="text"
                          className="input input-sm input-bordered w-full mt-1 bg-base-100 text-sm"
                          value={formData[item.field]}
                          onChange={(e) =>
                            setFormData({ ...formData, [item.field]: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-sm font-semibold text-neutral mt-0.5 truncate">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick info row */}
              <div className="mt-4 pt-4 border-t border-base-200/50 grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-base-200/20">
                  <p className="text-[10px] font-semibold text-neutral/50 uppercase tracking-wider">
                    Member Since
                  </p>
                  <p className="text-sm font-bold text-neutral mt-1">
                    {user?.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-base-200/20">
                  <p className="text-[10px] font-semibold text-neutral/50 uppercase tracking-wider">
                    Last Sign In
                  </p>
                  <p className="text-sm font-bold text-neutral mt-1">
                    {user?.metadata?.lastSignInTime
                      ? new Date(user.metadata.lastSignInTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Quick Actions + Stats ─── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Stats */}
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6">
              <h2 className="text-lg font-bold text-neutral flex items-center gap-2">
                <i className="fa-solid fa-chart-simple text-primary text-base"></i>
                Overview
              </h2>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  {
                    label: "Questions",
                    value: myQuestions.length,
                    icon: "fa-circle-question",
                    tone: "text-primary bg-primary/10",
                  },
                  {
                    label: "Answered",
                    value: myQuestions.filter((q) => q.status === "answered").length,
                    icon: "fa-circle-check",
                    tone: "text-success bg-success/10",
                  },
                  {
                    label: "Pending",
                    value: myQuestions.filter((q) => q.status === "pending").length,
                    icon: "fa-clock",
                    tone: "text-warning bg-warning/10",
                  },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-base-200/20">
                    <div
                      className={`w-9 h-9 rounded-lg ${s.tone} flex items-center justify-center mx-auto`}
                    >
                      <i className={`fa-solid ${s.icon} text-sm`}></i>
                    </div>
                    <p className="text-2xl font-bold text-neutral mt-2">{s.value}</p>
                    <p className="text-[10px] font-semibold text-neutral/50 uppercase tracking-wider mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6">
              <h2 className="text-lg font-bold text-neutral flex items-center gap-2">
                <i className="fa-solid fa-bolt text-primary text-base"></i>
                Quick Links
              </h2>
              <div className="mt-4 space-y-2">
                {[
                  {
                    to: "/dashboard/mybookings",
                    icon: "fa-bag-shopping",
                    label: "My Bookings",
                    desc: "View your reservations",
                    tone: "text-primary bg-primary/10",
                  },
                  {
                    to: "/dashboard/myquestions",
                    icon: "fa-circle-question",
                    label: "My Questions",
                    desc: "View all your Q&A",
                    tone: "text-info bg-info/10",
                  },
                  {
                    to: "/contact",
                    icon: "fa-headset",
                    label: "Contact Support",
                    desc: "Get help from our team",
                    tone: "text-success bg-success/10",
                  },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200/40 transition group"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${link.tone} flex items-center justify-center shrink-0`}
                    >
                      <i className={`fa-solid ${link.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral">{link.label}</p>
                      <p className="text-xs text-neutral/50">{link.desc}</p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs text-neutral/30 group-hover:text-primary transition"></i>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Asked Questions Section ─── */}
          <div className="lg:col-span-12">
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral flex items-center gap-2">
                    <i className="fa-solid fa-messages-question text-primary text-base"></i>
                    Asked Questions
                  </h2>
                  <p className="text-xs text-neutral/60 mt-0.5">
                    Your submitted questions and admin replies
                  </p>
                </div>
                <Link to="/question/create" className="btn btn-sm btn-primary text-white">
                  <i className="fa-solid fa-plus mr-1.5"></i>New Question
                </Link>
              </div>

              <div className="mt-5">
                {questionsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                ) : myQuestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-neutral/50 gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <i className="fa-solid fa-inbox text-3xl text-primary/30"></i>
                    </div>
                    <p className="text-sm font-medium mt-1">No questions yet</p>
                    <p className="text-xs text-neutral/40">
                      Ask your first question and get help from our team.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myQuestions.map((q) => {
                      const isOpen = expandedQId === q._id;
                      return (
                        <div
                          key={q._id}
                          className={`rounded-xl border overflow-hidden transition-all ${isOpen ? "bg-base-200/20 border-primary/20 shadow-sm" : "bg-base-200/10 border-base-200/40 hover:border-base-200/70"}`}
                        >
                          <button
                            className="w-full text-left p-4 flex items-start gap-3 transition"
                            onClick={() => setExpandedQId(isOpen ? null : q._id)}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${q.status === "answered" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}
                            >
                              <i
                                className={`fa-solid ${q.status === "answered" ? "fa-check" : "fa-clock"} text-xs`}
                              ></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-neutral text-sm">{q.title}</h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-neutral/50">
                                <span className="inline-flex items-center gap-1">
                                  <i className="fa-solid fa-folder text-[9px]"></i>
                                  {q.category}
                                </span>
                                <span>
                                  {q.createdAt
                                    ? new Date(q.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : ""}
                                </span>
                                <span
                                  className={`font-semibold ${q.status === "answered" ? "text-success" : "text-warning"}`}
                                >
                                  {q.status === "answered" ? "Answered" : "Pending"}
                                </span>
                              </div>
                            </div>
                            <i
                              className={`fa-solid fa-chevron-down text-xs text-neutral/40 transition-transform duration-200 mt-2 ${isOpen ? "rotate-180" : ""}`}
                            ></i>
                          </button>

                          {isOpen && (
                            <div className="px-4 pb-4 border-t border-base-200/40 ml-11">
                              {/* Tags */}
                              {q.tags?.length > 0 && (
                                <div className="flex gap-1.5 flex-wrap mt-3">
                                  {q.tags.map((t, i) => (
                                    <span key={i} className="badge badge-ghost badge-sm">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="mt-3 bg-base-100/80 p-4 rounded-xl border border-base-200/40">
                                <p className="text-xs font-semibold text-neutral/50 mb-1.5">
                                  Your Question
                                </p>
                                <p className="text-sm text-neutral/80 whitespace-pre-wrap leading-relaxed">
                                  {q.details}
                                </p>
                              </div>
                              {q.status === "answered" && q.reply ? (
                                <div className="mt-3 bg-success/5 p-4 rounded-xl border border-success/20">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <i className="fa-solid fa-user-shield text-success text-xs"></i>
                                    <p className="text-xs font-bold text-success">Admin Reply</p>
                                    {q.repliedAt && (
                                      <span className="text-[10px] text-neutral/40 ml-auto">
                                        {new Date(q.repliedAt).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-neutral/80 whitespace-pre-wrap leading-relaxed">
                                    {q.reply}
                                  </p>
                                </div>
                              ) : (
                                <div className="mt-3 flex items-center gap-2 text-xs text-warning/80 p-3 rounded-xl bg-warning/5 border border-warning/15">
                                  <span className="loading loading-dots loading-xs text-warning"></span>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
