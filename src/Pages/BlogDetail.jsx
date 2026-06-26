import React, { useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import Loader from "./Shared/Loader.jsx";
import toast from "react-hot-toast";
import { ENDPOINT } from "../config/env";
import useBlogs from "../hooks/useBlogs";
import { slugify } from "../utils/slugify";

const BlogDetail = () => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef(null);
  const [user] = useAuthState(auth);

  const { data: blogdetail, isLoading } = useQuery(
    ["blogdetail", slug],
    () => fetch(`${ENDPOINT}/blogdetail/${slug}`).then((res) => res.json()),
  );
  const [blogs, blogsLoading] = useBlogs();

  const { data: ratingSummary, refetch: refetchSummary } = useQuery(
    ["blogRatingSummary", blogdetail?._id],
    () => fetch(`${ENDPOINT}/blog-rating-summary/${blogdetail._id}`).then((res) => res.json()),
    { enabled: !!blogdetail?._id }
  );

  const userId = user?.email || user?.uid;

  const { data: userRating, refetch: refetchUserRating } = useQuery(
    ["blogUserRating", blogdetail?._id, userId],
    () => fetch(`${ENDPOINT}/blog-rating/${blogdetail._id}?email=${userId}`).then((res) => res.json()),
    { enabled: !!blogdetail?._id && !!userId }
  );

  const handleRate = async (star) => {
    if (!user) {
      toast.error("Please login to rate this blog.");
      return;
    }
    const currentUserId = user.email || user.uid;
    try {
      const res = await fetch(`${ENDPOINT}/blog-rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: blogdetail._id,
          email: currentUserId,
          rating: star,
        }),
      });
      if (res.ok) {
        toast.success("Rating submitted!");
        refetchSummary();
        refetchUserRating();
      } else {
        toast.error("Failed to submit rating.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while submitting.");
    }
  };
  if (isLoading) {
    return <Loader />;
  }

  if (blogdetail?.message === "Blog not found" || (!isLoading && !blogdetail?._id)) {
    return (
      <div className="bg-accent min-h-[70vh] font-[Poppins] flex items-center justify-center py-12">
        <div className="text-center p-8 bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl max-w-md w-full mx-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <i className="fa-solid fa-newspaper text-3xl"></i>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral">Blog post not found</h2>
          <p className="mt-3 text-neutral/70">The post you are looking for doesn't exist or has been removed.</p>
          <Link to="/blogs" className="btn btn-primary text-white mt-6 w-full">
            Read other posts
          </Link>
        </div>
      </div>
    );
  }
  const { image, date, role, title, post, description } = blogdetail || {};

  const latest =
    blogs?.filter((b) => String(b._id) !== String(blogdetail?._id))?.slice(0, 4) || [];

  const paragraphs = (post || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const readingMinutes = Math.max(
    1,
    Math.ceil((post || "").trim().split(/\s+/).filter(Boolean).length / 220),
  );

  return (
    <div className="bg-accent font-[Poppins]">
      {/* Hero */}
      <div className="app-container pt-6 pb-6">
        <nav className="text-sm text-neutral/70">
          <Link className="hover:text-primary" to="/">
            Home
          </Link>{" "}
          <span className="mx-2">/</span>
          <Link className="hover:text-primary" to="/blogs">
            Blogs
          </Link>{" "}
          <span className="mx-2">/</span>
          <span className="text-neutral/90">Details</span>
        </nav>

        <div className="mt-4 grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral leading-tight">
              {title}
            </h1>
            {(description || role || date) && (
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wider text-neutral/60 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Overview
                </div>
                <p className="mt-2 pl-4 border-l-2 border-primary/40 text-[15px] sm:text-base leading-relaxed text-neutral/75 max-w-[68ch]">
                  {description || "A thoughtful read from VacationRental."}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral/70">
              <span className="inline-flex items-center gap-2">
                <span className="badge badge-primary badge-sm"></span>
                <span className="font-semibold text-primary">Hotel</span>
              </span>
              {date && (
                <span className="inline-flex items-center gap-2">
                  <i className="fa-solid fa-calendar-days"></i>
                  <span>{date}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <i className="fa-solid fa-user"></i>
                <span>
                  {role ? `By ${role}` : "By VacationRental"}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 text-yellow-500">
                <i className="fa-solid fa-star"></i>
                <span className="ml-1 text-neutral/80 font-medium">
                  {ratingSummary?.avg || 0}
                </span>
                <span className="ml-1 text-neutral/60 text-xs">
                  ({ratingSummary?.count || 0})
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="fa-regular fa-eye"></i>
                <span>{blogdetail?.readCount || 1} Views</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-5">
              <p className="text-sm font-semibold text-neutral">Quick actions</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link to="/room" className="btn btn-secondary text-white btn-sm">
                  Browse rooms
                </Link>
                <Link to="/contact" className="btn btn-outline btn-sm">
                  Contact
                </Link>
              </div>
              <p className="mt-4 text-xs text-neutral/60">
                Tip: Save this page or share it with your friends.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl overflow-hidden border border-base-200/60 shadow-xl bg-base-100/40 backdrop-blur-xl">
          <img
            src={image}
            alt={title || "Blog cover"}
            className="w-full h-[220px] sm:h-[320px] lg:h-[420px] object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Body */}
      <div className="app-container pb-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <article className="lg:col-span-8">
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 sm:p-8">
              <header className="pb-5 border-b border-base-200/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral/60">
                    <span className="inline-flex items-center gap-2">
                      <i className="fa-regular fa-clock"></i>
                      <span>{readingMinutes} min read</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <i className="fa-regular fa-file-lines"></i>
                      <span>{paragraphs.length || 0} sections</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="#article"
                      className="btn btn-outline btn-sm rounded-full"
                    >
                      <i className="fa-solid fa-book-open mr-2"></i>
                      Read
                    </a>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-full text-white ${
                        copied ? "btn-success" : "btn-primary"
                      }`}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href);
                          setCopied(true);
                          if (copiedTimerRef.current) {
                            window.clearTimeout(copiedTimerRef.current);
                          }
                          copiedTimerRef.current = window.setTimeout(() => {
                            setCopied(false);
                            copiedTimerRef.current = null;
                          }, 1800);
                        } catch {
                          // ignore clipboard errors (non-secure context / permissions)
                        }
                      }}
                    >
                      <i
                        className={`mr-2 ${
                          copied ? "fa-solid fa-check" : "fa-regular fa-copy"
                        }`}
                      ></i>
                      {copied ? "Copied" : "Copy link"}
                    </button>
                  </div>
                </div>
              </header>

              <div id="article" className="pt-6">
                <div className="space-y-6 text-neutral/80 leading-[1.85]">
                  {paragraphs.length ? (
                    paragraphs.map((p, idx) => (
                      <p
                        key={idx}
                        className={
                          idx === 0
                            ? "text-[16px] sm:text-[18px] text-neutral/80 leading-[1.9] max-w-[72ch]"
                            : "text-base sm:text-[17px] max-w-[72ch]"
                        }
                      >
                        {p}
                      </p>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-base-200/60 bg-base-100/40 p-6">
                      <p className="text-base sm:text-[17px] text-neutral/70">
                        This post doesn’t have content yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 bg-base-100/40 p-5 rounded-xl border border-base-200/60 inline-block">
                <h3 className="text-sm font-semibold text-neutral mb-3">Rate this article</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => handleRate(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        userRating?.rating >= star ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      <i className="fa-solid fa-star"></i>
                    </button>
                  ))}
                </div>
                {!user && <p className="text-xs text-neutral/60 mt-2">Please login to rate</p>}
              </div>

              <div className="mt-10 pt-6 border-t border-base-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link to="/blogs" className="btn btn-outline">
                  <i className="fa-solid fa-arrow-left mr-2"></i>
                  Back to blogs
                </Link>
                <div className="flex flex-wrap gap-3">
                  <a
                    className="btn btn-outline"
                    href={`mailto:?subject=${encodeURIComponent(
                      title || "Blog post",
                    )}&body=${encodeURIComponent(window.location.href)}`}
                  >
                    <i className="fa-regular fa-envelope mr-2"></i>
                    Email
                  </a>
                  <Link to="/contact" className="btn btn-primary text-white">
                    Ask a question
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6">
              <p className="text-sm font-semibold text-neutral">About the author</p>
              <p className="mt-2 text-sm text-neutral/70">
                {role
                  ? `${role} shares updates and travel tips for better stays.`
                  : "VacationRental shares updates and travel tips for better stays."}
              </p>
            </div>

            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral">Latest posts</p>
                <Link to="/blogs" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              {blogsLoading ? (
                <p className="mt-3 text-sm text-neutral/60">Loading…</p>
              ) : latest.length ? (
                <div className="mt-4 space-y-4">
                  {latest.map((b) => (
                    <Link
                      key={b._id}
                      to={`/blogDetail/${slugify(b.title)}`}
                      className="flex gap-3 group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-base-200/60 bg-base-100/40">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral group-hover:text-primary transition overflow-hidden text-ellipsis">
                          {b.title}
                        </p>
                        <p className="text-xs text-neutral/60 mt-1">
                          {b.date ? b.date : "—"} {b.role ? `• ${b.role}` : ""}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-neutral/60">No other posts yet.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
