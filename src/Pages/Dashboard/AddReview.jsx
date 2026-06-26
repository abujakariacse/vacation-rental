import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import toast from "react-hot-toast";
import useProfilePhoto from "../../hooks/useProfilePhoto";
import { ENDPOINT } from "../../config/env";

const AddReview = () => {
  const [user] = useAuthState(auth);
  const photo = useProfilePhoto();
  const [hasBooking, setHasBooking] = useState(null); // null = loading

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    title: "",
    comment: "",
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  // Check if user has at least one booking
  useEffect(() => {
    if (user?.email) {
      fetch(`${ENDPOINT}/mybookings?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          setHasBooking(Array.isArray(data) && data.length > 0);
        })
        .catch(() => setHasBooking(false));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const reviewData = {
      name: formData.name,
      title: formData.title,
      comment: formData.comment,
      rating: formData.rating,
      image: photo || user?.photoURL || "https://i.ibb.co/XzGLjL6/user.png",
      email: user?.email || "",
    };

    try {
      const res = await fetch(`${ENDPOINT}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
      });
      if(!res.ok) throw new Error("Failed to post review");
      
      toast.success("Review submitted! It will appear on the homepage after admin approval.");
      setFormData({ name: user?.displayName || "", title: "", comment: "", rating: 5 });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-[Poppins] text-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide">Community</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Add Review</h2>
          <p className="text-sm text-neutral/60 mt-2">
            Share your experience with others and let us know how we did.
          </p>
        </div>
      </div>

      {/* Check booking status */}
      {hasBooking === null ? (
        <div className="flex items-center justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : !hasBooking ? (
        <div className="w-full max-w-3xl bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto">
            <i className="fa-solid fa-lock text-3xl text-warning/60"></i>
          </div>
          <h3 className="text-lg font-bold text-neutral mt-4">Booking Required</h3>
          <p className="text-neutral/60 mt-2 max-w-md mx-auto">
            You need to have at least one booking to leave a review. Book a room first and share your experience!
          </p>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-neutral/70 ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="input input-sm input-bordered w-full mt-1 bg-white/60 focus:bg-white transition"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral/70 ml-1">Profession / Title</label>
                <input
                  required
                  type="text"
                  placeholder="Software Engineer"
                  className="input input-sm input-bordered w-full mt-1 bg-white/60 focus:bg-white transition"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-neutral/70 ml-1">Rating</label>
                <div className="rating rating-md gap-1 ml-3 mt-2 block">
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked={formData.rating === 1} onChange={() => setFormData({ ...formData, rating: 1 })} />
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked={formData.rating === 2} onChange={() => setFormData({ ...formData, rating: 2 })} />
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked={formData.rating === 3} onChange={() => setFormData({ ...formData, rating: 3 })} />
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked={formData.rating === 4} onChange={() => setFormData({ ...formData, rating: 4 })} />
                  <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked={formData.rating === 5} onChange={() => setFormData({ ...formData, rating: 5 })} />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral/70 ml-1">Your Review</label>
              <textarea
                required
                rows="5"
                placeholder="Tell us about your stay..."
                className="textarea textarea-bordered w-full mt-1 bg-white/60 focus:bg-white transition text-sm leading-relaxed"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              ></textarea>
            </div>
            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                disabled={submitting} 
                className="btn btn-primary text-white px-8"
              >
                {submitting ? "Submitting..." : "Submit Review"}
                {!submitting && <i className="fa-solid fa-paper-plane ml-2"></i>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddReview;
