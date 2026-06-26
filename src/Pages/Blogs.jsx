import React, { useMemo, useState } from "react";
import BlogsBannaer from "../images/blog-1.webp";
import { Parallax } from "react-parallax";
import useBlogs from "../hooks/useBlogs";
import { Link } from "react-router-dom";
import Loader from "./Shared/Loader.jsx";
import { slugify } from "../utils/slugify";
const Blogs = () => {
  const [blogs, isLoading] = useBlogs();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs || [];
    return (blogs || []).filter((b) => {
      const hay = `${b?.title || ""} ${b?.description || ""} ${b?.post || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [blogs, query]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-accent font-[Poppins]">
      <Parallax
        bgImage={BlogsBannaer}
        bgImageStyle={{ height: "600px", width: "100%" }}
        strength={400}
        bgClassName="parallax-image"
      >
        <div className="parallex-gradient h-96 flex items-center">
          <div className="app-container">
            <p className="text-lg text-white/90">
              Home <i className="fa-solid fa-angle-right text-xs"></i> Blogs{" "}
              <i className="fa-solid fa-angle-right text-xs"></i>
            </p>
            <h1 className="lg:text-6xl text-4xl font-serif text-white font-semibold mt-6">
              Blogs
            </h1>
            <p className="text-white/80 mt-4 max-w-2xl">
              Practical travel tips, stay guides, and updates from VacationRental.
            </p>
          </div>
        </div>
      </Parallax>

      <section className="section-y">
        <div className="app-container">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary tracking-wide">All posts</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Browse our blog</h2>
              <p className="text-neutral/70 mt-2">
                {filtered.length} post{filtered.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="w-full lg:w-[420px]">
              <label className="text-xs font-semibold text-neutral/70">Search</label>
              <div className="mt-2 relative">
                <i className="fa-solid fa-magnifying-glass text-neutral/50 absolute left-4 top-1/2 -translate-y-1/2"></i>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title or keywords..."
                  className="input w-full bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-sm rounded-2xl pl-11"
                />
              </div>
            </div>
          </div>

          {filtered.length ? (
            <>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blogDetail/${slugify(blog.title)}`}
                  className="group bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition"
                >
                  <div className="relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-56 object-cover group-hover:scale-[1.02] transition"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent"></div>
                    <div className="absolute left-4 bottom-3 flex items-center gap-2 text-xs text-white/90">
                      <span className="inline-flex items-center gap-2">
                        <i className="fa-solid fa-calendar-days"></i>
                        <span>{blog.date || "—"}</span>
                      </span>
                      <span className="text-white/60">•</span>
                      <span className="inline-flex items-center gap-2">
                        <i className="fa-solid fa-user"></i>
                        <span>{blog.role || "VacationRental"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-neutral leading-snug group-hover:text-primary transition line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-neutral/70 mt-2 line-clamp-3">
                      {blog.description || blog.post || "Read the full post for details."}
                    </p>
                    <div className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                      Read more <i className="fa-solid fa-arrow-right ml-2"></i>
                    </div>
                  </div>
                </Link>
              ))}
              </div>
              
              {Math.ceil(filtered.length / itemsPerPage) > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    className="btn btn-outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1 hidden sm:flex">
                    {Array.from({ length: Math.ceil(filtered.length / itemsPerPage) }).map((_, i) => (
                      <button
                        key={i}
                        className={`btn ${currentPage === i + 1 ? "btn-primary text-white" : "btn-ghost"}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    className="btn btn-outline"
                    disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
                    onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filtered.length / itemsPerPage), p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-10 bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-10 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <i className="fa-solid fa-newspaper text-3xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral mt-6">No posts match your search</h3>
              <p className="text-neutral/70 mt-2">Try a different keyword.</p>
              <div className="mt-6">
                <button type="button" className="btn btn-outline" onClick={() => setQuery("")}>
                  Clear search
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;