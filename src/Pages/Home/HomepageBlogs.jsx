import React from "react";
import { Link } from "react-router-dom";
import useBlogs from "../../hooks/useBlogs";
import Loader from "../Shared/Loader.jsx";
import { slugify } from "../../utils/slugify";

const HomepageBlogs = () => {
  const [blogs, isLoading] = useBlogs();
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="font-[Poppins] bg-accent section-y">
      <div className="app-container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-primary tracking-wide">News & Blog</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral mt-2">
              Latest news from our blog
            </h2>
            <p className="text-neutral/70 mt-3 max-w-2xl">
              Travel tips, stay guides, and updates from VacationRental.
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Link to="/blogs" className="btn btn-outline">
              View all blogs
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>

        {blogs?.length ? (
          <div className="mt-8 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {blogs?.slice(0, 3).map((blog) => (
              <Link
                key={blog._id}
                to={`/blogDetail/${slugify(blog.title)}`}
                className="group bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition"
              >
                <div className="relative">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-52 object-cover group-hover:scale-[1.02] transition"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
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
        ) : (
          <div className="mt-10 bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-10 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <i className="fa-solid fa-newspaper text-3xl"></i>
              </div>
            </div>
            <h3 className="text-xl font-bold text-neutral mt-6">No blog posts yet</h3>
            <p className="text-neutral/70 mt-2">Please check back soon for new updates.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomepageBlogs;