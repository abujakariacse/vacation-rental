import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { ENDPOINT } from "../../config/env";

function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const EMPTY_FORM = {
    title: "",
    image: "",
    description: "",
    post: "",
    date: todayISO(),
    role: "VacationRental",
};

function buildPayload(form) {
    return {
        title: form.title.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
        post: form.post.trim(),
        date: form.date ? new Date(form.date).toLocaleDateString() : "",
        role: form.role.trim() || "VacationRental",
    };
}

const BlogsAdmin = () => {
    const queryClient = useQueryClient();
    const [query, setQuery] = useState("");
    const [modal, setModal] = useState(null); // { mode: "add" | "edit", blogId?: string }
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploadingImage, setUploadingImage] = useState(false);

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

    const { data: blogs = [], isLoading } = useQuery("blogs", () =>
        fetch(`${ENDPOINT}/blogs`).then((r) => r.json())
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return blogs;
        return blogs.filter((b) => {
            const hay = `${b?.title || ""} ${b?.description || ""} ${b?.role || ""}`.toLowerCase();
            return hay.includes(q);
        });
    }, [blogs, query]);

    /* ─── mutations ─── */
    const createBlog = useMutation({
        mutationFn: async (payload) => {
            const res = await fetch(`${ENDPOINT}/blog`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Failed to publish blog");
            return data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries("blogs");
            setModal(null);
            toast.success("Blog published successfully!");
        },
        onError: (err) => toast.error(err?.message || "Failed to publish blog."),
    });

    const updateBlog = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await fetch(`${ENDPOINT}/blog/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Failed to update blog");
            return data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries("blogs");
            setModal(null);
            toast.success("Blog updated successfully!");
        },
        onError: (err) => toast.error(err?.message || "Failed to update blog."),
    });

    const deleteBlog = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`${ENDPOINT}/blog/${id}`, { method: "DELETE" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Failed to delete blog");
            return data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries("blogs");
            toast.success("Blog deleted.");
        },
        onError: (err) => toast.error(err?.message || "Failed to delete blog."),
    });

    /* ─── handlers ─── */
    const openAdd = () => {
        setForm({ ...EMPTY_FORM, date: todayISO() });
        setModal({ mode: "add" });
    };

    const openEdit = (blog) => {
        setForm({
            title: blog.title || "",
            image: blog.image || "",
            description: blog.description || "",
            post: blog.post || "",
            date: todayISO(),
            role: blog.role || "VacationRental",
        });
        setModal({ mode: "edit", blogId: blog._id });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = buildPayload(form);
        if (!payload.title || !payload.image || !payload.description || !payload.post) {
            toast.error("Title, image, description and post content are required.");
            return;
        }
        if (modal?.mode === "add") {
            createBlog.mutate(payload);
        } else if (modal?.mode === "edit" && modal.blogId) {
            updateBlog.mutate({ id: modal.blogId, payload });
        }
    };

    const busy = createBlog.isLoading || updateBlog.isLoading || deleteBlog.isLoading;

    return (
        <div className="font-[Poppins] text-sm">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                    <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Blog Posts</h2>
                    <p className="text-sm text-neutral/60 mt-2">
                        Manage all published posts — add, edit, or remove content.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center shrink-0">
                    {/* Search */}
                    <div className="relative w-full sm:w-[260px]">
                        <i className="fa-solid fa-magnifying-glass text-neutral/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search posts..."
                            className="input w-full bg-base-100/70 border border-base-200/60 rounded-2xl pl-11"
                        />
                    </div>
                    <button type="button" className="btn btn-primary text-white shrink-0" onClick={openAdd}>
                        <i className="fa-solid fa-plus mr-2"></i>
                        Add Blog
                    </button>
                </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Total Posts", value: blogs.length, icon: "fa-newspaper", tone: "bg-primary/10 text-primary border-primary/20" },
                    { label: "Showing", value: filtered.length, icon: "fa-filter", tone: "bg-info/10 text-info border-info/20" },
                    { label: "Authors", value: [...new Set(blogs.map((b) => b.role).filter(Boolean))].length || 1, icon: "fa-user-pen", tone: "bg-success/10 text-success border-success/20" },
                ].map((s) => (
                    <div
                        key={s.label}
                        className={`rounded-2xl border shadow-sm p-4 sm:p-5 bg-base-100/60 backdrop-blur-xl flex items-center gap-4 ${s.tone}`}
                    >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-current/10">
                            <i className={`fa-solid ${s.icon} text-lg`}></i>
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wider uppercase opacity-70">{s.label}</p>
                            <p className="mt-0.5 text-2xl sm:text-3xl font-bold leading-none">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Blog Grid ── */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-neutral/50 gap-3">
                    <i className="fa-solid fa-newspaper text-5xl text-primary/30"></i>
                    <p className="text-base font-medium">
                        {query ? "No posts match your search." : "No blog posts yet."}
                    </p>
                    {!query && (
                        <button type="button" className="btn btn-primary btn-sm text-white mt-2" onClick={openAdd}>
                            <i className="fa-solid fa-plus mr-2"></i>Add your first post
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((blog) => (
                        <div
                            key={blog._id}
                            className="group bg-base-100/70 backdrop-blur-xl border border-base-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                        >
                            {/* Cover image */}
                            <div className="relative h-44 overflow-hidden bg-base-200/40 shrink-0">
                                {blog.image ? (
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                        loading="lazy"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral/30">
                                        <i className="fa-regular fa-image text-4xl"></i>
                                    </div>
                                )}
                                {/* Date badge */}
                                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                                    <i className="fa-solid fa-calendar-days"></i>
                                    <span>{blog.date || "—"}</span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                        <i className="fa-solid fa-user text-[10px]"></i>
                                        {blog.role || "VacationRental"}
                                    </span>
                                </div>

                                <h3 className="font-bold text-neutral text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="mt-2 text-neutral/60 text-sm line-clamp-2 flex-1">
                                    {blog.description || blog.post || "—"}
                                </p>

                                {/* Actions */}
                                <div className="mt-4 pt-3 border-t border-base-200/60 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline btn-sm flex-1"
                                        onClick={() => openEdit(blog)}
                                        disabled={busy}
                                    >
                                        <i className="fa-solid fa-pen-to-square mr-1.5"></i>Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-error btn-sm text-white flex-1"
                                        disabled={busy}
                                        onClick={() => {
                                            Swal.fire({
                                                title: "Are you sure?",
                                                text: "Delete this blog post? This cannot be undone.",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#d33",
                                                cancelButtonColor: "#3085d6",
                                                confirmButtonText: "Yes, delete it!"
                                            }).then(result => {
                                                if (result.isConfirmed) deleteBlog.mutate(blog._id);
                                            });
                                        }}
                                    >
                                        <i className="fa-solid fa-trash mr-1.5"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Footer count ── */}
            {!isLoading && filtered.length > 0 && (
                <p className="mt-5 text-xs text-neutral/40 text-right">
                    Showing {filtered.length} of {blogs.length} post{blogs.length !== 1 ? "s" : ""}
                </p>
            )}

            {/* ── Modal ── */}
            {modal && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-2xl max-h-[92vh] overflow-y-auto bg-base-100 text-base-content">
                        {/* Modal header */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-primary tracking-wide">
                                    {modal.mode === "add" ? "New post" : "Edit post"}
                                </p>
                                <h3 className="text-xl font-bold text-neutral mt-1">
                                    {modal.mode === "add" ? "Create a blog post" : "Update blog details"}
                                </h3>
                            </div>
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => setModal(null)}
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        {/* Live image preview strip */}
                        {form.image && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-base-200/60 h-36">
                                <img
                                    src={form.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.opacity = "0.3"; }}
                                />
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Title */}
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-neutral/70">Title *</label>
                                <input
                                    className="mt-2 input input-bordered w-full"
                                    value={form.title}
                                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                    placeholder="Write a clear title..."
                                    required
                                />
                            </div>

                            {/* Image */}
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-neutral/70">Cover image *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="mt-2 file-input file-input-bordered w-full"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                    title="Upload from device"
                                />
                            </div>

                            {/* Date + Author */}
                            <div>
                                <label className="text-xs font-semibold text-neutral/70">Date</label>
                                <input
                                    type="date"
                                    className="mt-2 input input-bordered w-full"
                                    value={form.date}
                                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-neutral/70">Author</label>
                                <input
                                    className="mt-2 input input-bordered w-full"
                                    value={form.role}
                                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                                    placeholder="VacationRental"
                                />
                            </div>

                            {/* Short description */}
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-neutral/70">Short description *</label>
                                <textarea
                                    className="mt-2 textarea textarea-bordered w-full min-h-[80px]"
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    placeholder="1-2 sentence summary..."
                                    required
                                ></textarea>
                            </div>

                            {/* Post content */}
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-neutral/70">Post content *</label>
                                <textarea
                                    className="mt-2 textarea textarea-bordered w-full min-h-[160px]"
                                    value={form.post}
                                    onChange={(e) => setForm((f) => ({ ...f, post: e.target.value }))}
                                    placeholder="Write the full post. Use blank lines to separate paragraphs..."
                                    required
                                ></textarea>
                            </div>

                            {/* Actions */}
                            <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 border-t border-base-200/60">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setModal(null)}
                                    disabled={busy}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary text-white" disabled={busy}>
                                    {busy
                                        ? (modal.mode === "add" ? "Publishing..." : "Saving...")
                                        : (modal.mode === "add" ? "Publish post" : "Save changes")}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={() => setModal(null)}></div>
                </dialog>
            )}
        </div>
    );
};

export default BlogsAdmin;
