import React from "react";
import { Link } from "react-router-dom";

const Blog = ({ blog, handleBlogLoad }) => {
  const { _id, image, title, description, date, role } = blog;
  return (
    <div
      onClick={() => handleBlogLoad(_id)}
      className="group lg:w-96 w-80 mx-auto lg:mx-0 bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl my-4 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition"
    >
      <div className="relative">
        <img
          className="w-full h-52 object-cover group-hover:scale-[1.02] transition"
          src={image}
          alt={title || "blog"}
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent"></div>
        <div className="absolute left-4 bottom-3 flex items-center gap-2 text-xs text-white/90">
          <span className="inline-flex items-center gap-2">
            <i className="fa-solid fa-calendar-days"></i>
            <span>{date || "—"}</span>
          </span>
          <span className="text-white/60">•</span>
          <span className="inline-flex items-center gap-2">
            <i className="fa-solid fa-user"></i>
            <span>{role || "VacationRental"}</span>
          </span>
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-lg font-bold text-neutral leading-snug group-hover:text-primary transition line-clamp-2">
          <Link to="/">{title}</Link>
        </h2>
        <p className="mt-3 text-sm text-neutral/70 leading-relaxed line-clamp-3">
          {description || "Read the full post for details."}
        </p>
      </div>
    </div>
  );
};

export default Blog;