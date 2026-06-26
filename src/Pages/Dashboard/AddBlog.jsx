import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { ENDPOINT } from "../../config/env";

const initialForm = {
  title: "",
  image: "",
  description: "",
  post: "",
  date: "",
  role: "",
};

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const AddBlog = () => {
  const [form, setForm] = useState(() => ({ ...initialForm, date: todayISO(), role: "VacationRental" }));
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [authorFocus, setAuthorFocus] = useState(false);

  const { data: previousAuthors = [] } = useQuery("previousAuthors", async () => {
    const res = await fetch(`${ENDPOINT}/blog`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return Array.from(new Set(data.map((b) => b.role).filter(Boolean)));
  });

  const filteredAuthors = useMemo(() => {
    const q = form.role.toLowerCase();
    return previousAuthors.filter((a) => a.toLowerCase().includes(q));
  }, [form.role, previousAuthors]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
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
        if (!res.ok) throw new Error(data.error?.message || data.error || "Upload failed");
        
        setForm((f) => ({ ...f, image: data.secure_url }));
        toast.success("Image uploaded!");
      } catch (error) {
        console.error(error);
        toast.error("Error uploading: " + error.message);
      } finally {
        setUploadingImage(false);
      }
    };
  };

  const preview = useMemo(() => {
    const title = form.title.trim() || "Untitled post";
    const description = form.description.trim() || "Short description will appear here.";
    const role = form.role.trim() || "VacationRental";
    const date = form.date ? new Date(form.date).toLocaleDateString() : "—";
    return { title, description, role, date };
  }, [form]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      post: form.post.trim(),
      date: form.date ? new Date(form.date).toLocaleDateString() : "",
      role: form.role.trim() || "VacationRental",
    };

    if (!payload.title || !payload.image || !payload.description || !payload.post) {
      toast.error("Title, image, description, and post content are required.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${ENDPOINT}/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Failed to publish blog post.");
      }

      toast.success("Blog published successfully!");
      setForm({ ...initialForm, date: todayISO(), role: payload.role });
    } catch (err) {
      toast.error(err?.message || "Failed to publish. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-[Poppins]">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Add blog</h1>
          <p className="text-sm text-neutral/60 mt-2">
            Create a new post for the public blog listing.
          </p>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <div className="lg:col-span-7 bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral/70">Title</label>
              <input
                className="mt-2 input input-bordered w-full"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Write a clear title..."
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral/70">Cover image</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  title="Upload from device"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral/70">Date</label>
                <input
                  type="date"
                  className="mt-2 input input-bordered w-full"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="relative">
                <label className="text-xs font-semibold text-neutral/70">Author</label>
                <input
                  className="mt-2 input input-bordered w-full"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  onFocus={() => setAuthorFocus(true)}
                  onBlur={() => setTimeout(() => setAuthorFocus(false), 200)}
                  placeholder="VacationRental"
                />
                {authorFocus && (
                  <ul className="absolute z-10 mt-1 w-full bg-base-100 border border-base-200 rounded-box shadow-xl max-h-48 overflow-y-auto">
                    {filteredAuthors.map(a => (
                      <li key={a}>
                        <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-base-200 transition" onClick={() => {
                          setForm(f => ({...f, role: a}));
                          setAuthorFocus(false);
                        }}>
                          {a}
                        </button>
                      </li>
                    ))}
                    {!filteredAuthors.find(a => a.toLowerCase() === form.role.toLowerCase()) && form.role.trim() !== "" && (
                       <li>
                         <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-base-200 text-primary font-medium transition" onClick={() => setAuthorFocus(false)}>
                           Add new author: "{form.role}"
                         </button>
                       </li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral/70">Short description</label>
              <textarea
                className="mt-2 textarea textarea-bordered w-full min-h-[90px]"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="1–2 sentences summary shown on cards and the blog header..."
                required
              ></textarea>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral/70">Post content</label>
              <textarea
                className="mt-2 textarea textarea-bordered w-full min-h-[220px]"
                value={form.post}
                onChange={(e) => setForm((f) => ({ ...f, post: e.target.value }))}
                placeholder="Write the full post. Use line breaks for paragraphs..."
                required
              ></textarea>
              <p className="mt-2 text-xs text-neutral/60">
                Tip: Separate paragraphs with blank lines.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  setForm({ ...initialForm, date: todayISO(), role: form.role || "VacationRental" })
                }
                disabled={submitting}
              >
                Clear
              </button>
              <button type="submit" className="btn btn-primary text-white" disabled={submitting}>
                {submitting ? "Publishing..." : "Publish blog"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6">
            <p className="text-sm font-semibold text-neutral">Preview</p>
            <div className="mt-4 rounded-2xl overflow-hidden border border-base-200/60 bg-base-100/40">
              {form.image ? (
                <img src={form.image} alt="Cover preview" className="w-full h-44 object-cover" />
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-neutral/50">
                  {uploadingImage ? (
                    <span className="loading loading-spinner loading-md text-primary"></span>
                  ) : (
                    <i className="fa-regular fa-image text-3xl"></i>
                  )}
                </div>
              )}
            </div>
            <p className="mt-4 text-xs text-neutral/60">
              {preview.date} • {preview.role}
            </p>
            <h3 className="mt-2 text-lg font-bold text-neutral leading-snug">{preview.title}</h3>
            <p className="mt-2 text-sm text-neutral/70 leading-relaxed">{preview.description}</p>
          </div>

          <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6">
            <p className="text-sm font-semibold text-neutral">Notes</p>
            <ul className="mt-3 text-sm text-neutral/70 list-disc list-inside space-y-1">
              <li>Cover image should be a valid public URL.</li>
              <li>Description appears on the blog cards and in the blog header.</li>
              <li>Post content is rendered as paragraphs based on line breaks.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddBlog;

