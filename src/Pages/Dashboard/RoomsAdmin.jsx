import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { ENDPOINT } from "../../config/env";


const EMPTY_FORM = {
  name: "",
  image: "",
  rentFee: "",
  size: "",
  bed: "",
  view: "",
  max: "",
  detail: "",
};

function normalizeRoomPayload(form) {
  const rentFee = Number(form.rentFee);
  const bed = Number(form.bed);
  const max = Number(form.max);

  return {
    name: String(form.name || "").trim(),
    image: String(form.image || "").trim(),
    rentFee: Number.isFinite(rentFee) ? rentFee : form.rentFee,
    size: String(form.size || "").trim(),
    bed: Number.isFinite(bed) ? bed : form.bed,
    view: String(form.view || "").trim(),
    max: Number.isFinite(max) ? max : form.max,
    detail: String(form.detail || "").trim(),
  };
}

const RoomsAdmin = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(
    /** @type {null | { mode: "add" | "edit"; roomId?: string; initial: typeof EMPTY_FORM }} */(null),
  );
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

  const { data: rooms, isLoading } = useQuery("rooms", () =>
    fetch(`${ENDPOINT}/rooms`).then((res) => res.json()),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rooms || [];
    if (!q) return list;
    return list.filter((r) => {
      const hay = `${r?.name || ""} ${r?.view || ""} ${r?.size || ""} ${r?.rentFee || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rooms, query]);

  const createRoom = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${ENDPOINT}/room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Failed to create room");
      }
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries("rooms");
      setModal(null);
      toast.success("Room added successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to add room. Please try again.");
    },
  });

  const updateRoom = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await fetch(`${ENDPOINT}/room/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update room");
      }
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries("rooms");
      setModal(null);
      toast.success("Room updated successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update room. Please try again.");
    },
  });

  const deleteRoom = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${ENDPOINT}/room/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete room");
      }
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries("rooms");
      toast.success("Room deleted.");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete room. Please try again.");
    },
  });

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "add", initial: EMPTY_FORM });
  };

  const openEdit = (room) => {
    const initial = {
      name: room?.name || "",
      image: room?.image || "",
      rentFee: room?.rentFee ?? "",
      size: room?.size || "",
      bed: room?.bed ?? "",
      view: room?.view || "",
      max: room?.max ?? "",
      detail: room?.detail || "",
    };
    setForm(initial);
    setModal({ mode: "edit", roomId: room?._id, initial });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = normalizeRoomPayload(form);

    if (!payload.name || !payload.image) {
      toast.error("Name and image URL are required.");
      return;
    }

    if (modal?.mode === "add") {
      createRoom.mutate(payload);
      return;
    }
    if (modal?.mode === "edit" && modal.roomId) {
      updateRoom.mutate({ id: modal.roomId, payload });
    }
  };

  const busy = createRoom.isLoading || updateRoom.isLoading || deleteRoom.isLoading;

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 text-neutral/50">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  return (
    <div className="font-[Poppins]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide">Rooms</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">All rooms</h1>
          <p className="text-sm text-neutral/60 mt-2">
            {filtered.length} room{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <i className="fa-solid fa-magnifying-glass text-neutral/50 absolute left-4 top-1/2 -translate-y-1/2"></i>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rooms..."
              className="input w-full bg-base-100/70 border border-base-200/60 rounded-2xl pl-11"
            />
          </div>
          <button type="button" className="btn btn-primary text-white" onClick={openAdd}>
            <i className="fa-solid fa-plus mr-2"></i>
            Add room
          </button>
        </div>
      </div>

      <div className="mt-6 w-full overflow-x-auto rounded-2xl border border-base-200">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Room</th>
              <th>Price</th>
              <th>Size</th>
              <th>Bed</th>
              <th>Max</th>
              <th>View</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((r) => (
              <tr key={r._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-base-200 bg-base-100 shrink-0">
                      <img
                        src={r.image}
                        alt={r.name || "Room"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral truncate">{r.name}</p>
                      <p className="text-xs text-neutral/60 truncate">{r._id}</p>
                    </div>
                  </div>
                </td>
                <td className="font-semibold text-neutral">${r.rentFee}</td>
                <td className="text-neutral/70">{r.size || "—"}</td>
                <td className="text-neutral/70">{r.bed ?? "—"}</td>
                <td className="text-neutral/70">{r.max ?? "—"}</td>
                <td className="text-neutral/70">{r.view || "—"}</td>
                <td className="text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => openEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-error btn-sm text-white"
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "Delete this room? This cannot be undone.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#d33",
                          cancelButtonColor: "#3085d6",
                          confirmButtonText: "Yes, delete it!"
                        }).then(result => {
                          if (result.isConfirmed) deleteRoom.mutate(r._id);
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!filtered?.length && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-neutral/60">
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl bg-base-100 text-base-content">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary tracking-wide">
                  {modal.mode === "add" ? "Add room" : "Edit room"}
                </p>
                <h3 className="text-xl font-bold text-neutral mt-1">
                  {modal.mode === "add" ? "Create a new room" : "Update room details"}
                </h3>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-neutral/70">Name</label>
                <input
                  className="mt-2 input input-bordered w-full"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-neutral/70">Image</label>
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
                {form.image && (
                  <div className="mt-3">
                    <img src={form.image} alt="Preview" className="w-full h-40 object-cover rounded-xl shadow-sm border border-base-200/60" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral/70">Rent fee (per night)</label>
                <input
                  type="number"
                  min="0"
                  className="mt-2 input input-bordered w-full"
                  value={form.rentFee}
                  onChange={(e) => setForm((f) => ({ ...f, rentFee: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral/70">Size</label>
                <input
                  className="mt-2 input input-bordered w-full"
                  value={form.size}
                  onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                  placeholder="e.g. 18 m2"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral/70">Bed (count)</label>
                <input
                  type="number"
                  min="0"
                  className="mt-2 input input-bordered w-full"
                  value={form.bed}
                  onChange={(e) => setForm((f) => ({ ...f, bed: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral/70">Max guests</label>
                <input
                  type="number"
                  min="0"
                  className="mt-2 input input-bordered w-full"
                  value={form.max}
                  onChange={(e) => setForm((f) => ({ ...f, max: e.target.value }))}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-neutral/70">View</label>
                <input
                  className="mt-2 input input-bordered w-full"
                  value={form.view}
                  onChange={(e) => setForm((f) => ({ ...f, view: e.target.value }))}
                  placeholder="e.g. City view"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-neutral/70">Details</label>
                <textarea
                  className="mt-2 textarea textarea-bordered w-full min-h-[120px]"
                  value={form.detail}
                  onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
                  placeholder="Short description of the room..."
                ></textarea>
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-2">
                <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-white" disabled={busy}>
                  {modal.mode === "add" ? "Add room" : "Save changes"}
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

export default RoomsAdmin;

