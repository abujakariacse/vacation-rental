import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { ENDPOINT } from "../../config/env";
import Swal from "sweetalert2";

const CustomerBookings = ({ email }) => {
    const { data: bookings, isLoading } = useQuery(["customerBookings", email], () =>
        fetch(`${ENDPOINT}/mybookings?email=${encodeURIComponent(email)}`).then(r => r.json()),
        { enabled: !!email }
    );

    if (isLoading) return <div className="text-center py-4"><span className="loading loading-spinner loading-sm text-primary"></span></div>;
    if (!bookings || bookings.length === 0) return <p className="text-sm text-neutral/60 mt-2">No booking history found.</p>;

    return (
        <div className="mt-4 border-t border-base-200/60 pt-4">
            <p className="text-sm font-semibold text-neutral/60 uppercase mb-3">Booking History ({bookings.length})</p>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {bookings.map(b => (
                    <div key={b._id} className="bg-base-200/40 p-3 rounded-xl border border-base-200">
                        <div className="flex justify-between items-start gap-2">
                            <span className="font-semibold text-neutral text-sm truncate">{b.roomName || "Room"}</span>
                            <span className={`badge badge-xs sm:badge-sm text-white shrink-0 ${b.status === 'Approved' || b.status === 'Checkout' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-neutral/60">
                            <span>{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</span>
                            <span className="font-semibold text-neutral">${b.rentCost}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Customers = () => {
    const [query, setQuery] = useState("");
    const [suspendModal, setSuspendModal] = useState({ isOpen: false, userId: null, reason: "" });
    const [infoModal, setInfoModal] = useState(null);

    const { data: customers = [], isLoading: loading, refetch: loadUsers } = useQuery(
        "customers",
        () => fetch(`${ENDPOINT}/users?role=user`).then((r) => r.json()).then((d) => Array.isArray(d) ? d : []),
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return customers;
        return customers.filter((c) => {
            const hay = `${c?.name || ""} ${c?.email || ""} ${c?.phone || ""} ${c?.role || ""}`.toLowerCase();
            return hay.includes(q);
        });
    }, [customers, query]);

    const initials = (customer) => {
        const name = customer?.name || customer?.displayName || "";
        if (name) {
            return name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("");
        }
        return (customer?.email?.[0] || "U").toUpperCase();
    };

    /* Mutations */
    const makeAdmin = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`${ENDPOINT}/user/role/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "admin" }),
            });
            if (!res.ok) throw new Error("Failed to make admin");
            return res.json();
        },
        onSuccess: () => {
            toast.success("User promoted to admin!");
            loadUsers();
        },
        onError: () => toast.error("Error promoting user"),
    });

    const suspendUser = useMutation({
        mutationFn: async ({ id, reason }) => {
            const res = await fetch(`${ENDPOINT}/user/suspend/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });
            if (!res.ok) throw new Error("Failed to suspend user");
            return res.json();
        },
        onSuccess: () => {
            toast.success("User suspended successfully");
            setSuspendModal({ isOpen: false, userId: null, reason: "" });
            loadUsers();
        },
        onError: () => toast.error("Error suspending user"),
    });

    const unsuspendUser = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`${ENDPOINT}/user/unsuspend/${id}`, {
                method: "PUT",
            });
            if (!res.ok) throw new Error("Failed to unsuspend user");
            return res.json();
        },
        onSuccess: () => {
            toast.success("User unsuspended");
            loadUsers();
        },
        onError: () => toast.error("Error unsuspending user"),
    });

    const busy = makeAdmin.isLoading || suspendUser.isLoading || unsuspendUser.isLoading;

    return (
        <div className="font-[Poppins] text-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                    <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Customers</h2>
                    <p className="text-sm text-neutral/60 mt-2">
                        All registered customers with the role <span className="font-medium text-primary">user</span>.
                    </p>
                </div>

                {/* Search */}
                <div className="w-full sm:w-[320px]">
                    <label className="text-xs font-semibold text-neutral/70">Search</label>
                    <div className="mt-2 relative">
                        <i className="fa-solid fa-magnifying-glass text-neutral/50 absolute left-4 top-1/2 -translate-y-1/2"></i>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Name, email, phone..."
                            className="input w-full bg-base-100/70 border border-base-200/60 rounded-2xl pl-11"
                        />
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {[
                    {
                        label: "Total Customers",
                        value: customers.length,
                        icon: "fa-users",
                        tone: "bg-primary/10 text-primary border-primary/20",
                    },
                    {
                        label: "Search Results",
                        value: filtered.length,
                        icon: "fa-filter",
                        tone: "bg-info/10 text-info border-info/20",
                    },
                    {
                        label: "Role",
                        value: "User",
                        icon: "fa-id-badge",
                        tone: "bg-success/10 text-success border-success/20",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className={`rounded-2xl border shadow-sm p-4 sm:p-5 bg-base-100/60 backdrop-blur-xl flex items-center gap-4 ${s.tone}`}
                    >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-current/10 shrink-0">
                            <i className={`fa-solid ${s.icon} text-lg`}></i>
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wider uppercase opacity-70">{s.label}</p>
                            <p className="mt-0.5 text-2xl sm:text-3xl font-bold leading-none">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table / state */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-neutral/50">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-neutral/50 gap-3">
                    <i className="fa-solid fa-users-slash text-5xl text-primary/30"></i>
                    <p className="text-base font-medium">
                        {query ? "No customers match your search." : "No customers found."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block w-full overflow-visible rounded-2xl border border-base-200 bg-base-100/50 backdrop-blur-xl">
                        <table className="table w-full">
                            <thead>
                                <tr className="text-neutral/70 text-xs uppercase tracking-wide border-b border-base-200">
                                    <th className="pl-5">#</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th className="text-center">Role / Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c, i) => (
                                    <tr
                                        key={c._id || c.email}
                                        className="border-b border-base-200/50 hover:bg-base-200/30 transition-colors"
                                    >
                                        <td className="pl-5 text-neutral/40 font-medium">{i + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                {c.photoURL ? (
                                                    <img
                                                        src={c.photoURL}
                                                        alt={c.name}
                                                        className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center ring-2 ring-primary/20 shrink-0">
                                                        {initials(c)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-neutral leading-tight">
                                                        {c.name || c.displayName || "—"}
                                                    </p>
                                                    {c.createdAt && (
                                                        <p className="text-xs text-neutral/40">
                                                            Joined {new Date(c.createdAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-neutral/70">{c.email}</td>
                                        <td className="text-neutral/70">{c.phone || "—"}</td>
                                        <td className="text-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                                    <i className="fa-solid fa-circle text-[6px]"></i>
                                                    {c.role || "user"}
                                                </span>
                                                {c.isSuspended && (
                                                    <span title={c.suspendReason} className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-semibold bg-error/10 text-error border border-error/20">
                                                        <i className="fa-solid fa-ban text-[8px]"></i> Suspended
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="dropdown dropdown-left">
                                                <label tabIndex={0} className="btn btn-ghost btn-sm m-1">
                                                    <i className="fa-solid fa-ellipsis-vertical text-neutral/70"></i>
                                                </label>
                                                <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow-xl border border-base-200/60 bg-base-100/95 backdrop-blur-xl rounded-box w-48 text-left text-neutral">
                                                    <li>
                                                        <button disabled={busy} onClick={() => setInfoModal(c)}>
                                                            <i className="fa-solid fa-circle-info w-5 text-center text-info"></i> View Info
                                                        </button>
                                                    </li>
                                                    <div className="divider my-0.5"></div>
                                                    <li>
                                                        <button disabled={busy} onClick={() => {
                                                            Swal.fire({
                                                                title: "Promote to Admin?",
                                                                text: "They will be moved to the Admin team.",
                                                                icon: "warning",
                                                                showCancelButton: true,
                                                                confirmButtonText: "Yes, promote them!"
                                                            }).then(result => {
                                                                if (result.isConfirmed) makeAdmin.mutate(c._id);
                                                            });
                                                        }}>
                                                            <i className="fa-solid fa-user-shield w-5 text-center text-primary"></i> Make Admin
                                                        </button>
                                                    </li>
                                                    <div className="divider my-1"></div>
                                                    {c.isSuspended ? (
                                                        <li>
                                                            <button disabled={busy} onClick={() => unsuspendUser.mutate(c._id)}>
                                                                <i className="fa-solid fa-user-check w-5 text-center text-success"></i> Unsuspend
                                                            </button>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <button disabled={busy} onClick={() => setSuspendModal({ isOpen: true, userId: c._id, reason: "" })} className="text-error">
                                                                <i className="fa-solid fa-user-slash w-5 text-center"></i> Suspend
                                                            </button>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden grid grid-cols-1 gap-3">
                        {filtered.map((c, i) => (
                            <div
                                key={c._id || c.email}
                                className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
                            >
                                <div className="flex items-start gap-4">
                                    {c.photoURL ? (
                                        <img
                                            src={c.photoURL}
                                            alt={c.name}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center ring-2 ring-primary/20 shrink-0">
                                            {initials(c)}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <p className="font-semibold text-neutral truncate">
                                                {c.name || c.displayName || "—"}
                                            </p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0">
                                                    <i className="fa-solid fa-circle text-[5px]"></i>
                                                    {c.role || "user"}
                                                </span>
                                                {c.isSuspended && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error/10 text-error border border-error/20 shrink-0">
                                                        <i className="fa-solid fa-ban text-[5px]"></i> Suspended
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-neutral/60 mt-0.5 truncate">{c.email}</p>
                                        {c.phone && (
                                            <p className="text-xs text-neutral/50 mt-0.5">
                                                <i className="fa-solid fa-phone mr-1"></i>
                                                {c.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-base-200/60 flex flex-wrap items-center justify-end gap-2">
                                    <button disabled={busy} className="btn btn-sm btn-info text-white" onClick={() => setInfoModal(c)}>
                                        <i className="fa-solid fa-circle-info"></i> Info
                                    </button>
                                    <button disabled={busy} className="btn btn-sm btn-outline text-neutral" onClick={() => {
                                        Swal.fire({
                                            title: "Promote to Admin?",
                                            text: "Are you sure?",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonText: "Yes, promote!"
                                        }).then(result => {
                                            if (result.isConfirmed) makeAdmin.mutate(c._id);
                                        });
                                    }}>
                                        <i className="fa-solid fa-user-shield"></i> Admin
                                    </button>
                                    {c.isSuspended ? (
                                        <button disabled={busy} className="btn btn-sm btn-success text-white" onClick={() => unsuspendUser.mutate(c._id)}>
                                            <i className="fa-solid fa-user-check"></i> Unsuspend
                                        </button>
                                    ) : (
                                        <button disabled={busy} className="btn btn-sm btn-error text-white" onClick={() => setSuspendModal({ isOpen: true, userId: c._id, reason: "" })}>
                                            <i className="fa-solid fa-user-slash"></i> Suspend
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Footer count */}
            {!loading && filtered.length > 0 && (
                <p className="mt-4 text-xs text-neutral/40 text-right">
                    Showing {filtered.length} of {customers.length} customer{customers.length !== 1 ? "s" : ""}
                </p>
            )}

            {/* Suspend Modal */}
            {suspendModal.isOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box bg-base-100 text-base-content relative">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setSuspendModal({ isOpen: false, userId: null, reason: "" })}>✕</button>
                        <h3 className="font-bold text-lg text-error"><i className="fa-solid fa-triangle-exclamation mr-2"></i>Suspend User</h3>
                        <p className="py-4 text-sm text-neutral/70">Please provide a reason for suspending this user. This action will immediately restrict their access to the system.</p>
                        <textarea
                            className="textarea textarea-bordered w-full h-24 text-sm"
                            placeholder="Reason for suspension..."
                            value={suspendModal.reason}
                            onChange={(e) => setSuspendModal({ ...suspendModal, reason: e.target.value })}
                        ></textarea>
                        <div className="modal-action mt-5">
                            <button className="btn btn-outline text-neutral" onClick={() => setSuspendModal({ isOpen: false, userId: null, reason: "" })}>Cancel</button>
                            <button className="btn btn-error text-white" disabled={!suspendModal.reason.trim() || suspendUser.isLoading} onClick={() => suspendUser.mutate({ id: suspendModal.userId, reason: suspendModal.reason })}>
                                {suspendUser.isLoading ? "Suspending..." : "Confirm Suspend"}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop bg-black/20" onClick={() => setSuspendModal({ isOpen: false, userId: null, reason: "" })}></div>
                </dialog>
            )}

            {/* Info Modal */}
            {infoModal && (
                <dialog className="modal modal-open">
                    <div className="modal-box bg-base-100 text-base-content relative p-6">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" onClick={() => setInfoModal(null)}>✕</button>
                        <h3 className="font-bold text-lg mb-6"><i className="fa-solid fa-id-card text-info mr-2"></i>Customer Information</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                {infoModal.image || infoModal.photoURL ? (
                                    <img src={infoModal.image || infoModal.photoURL} alt={infoModal.name} className="w-24 h-24 rounded-2xl object-cover ring-2 ring-primary/20 shadow-md" />
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-base-200 text-neutral font-bold text-3xl flex items-center justify-center ring-2 ring-base-300 shadow-md">
                                        {initials(infoModal)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <p className="text-xs font-semibold text-neutral/60 uppercase">Full Name</p>
                                    <p className="text-base font-semibold text-neutral">{infoModal.name || infoModal.displayName || "Unknown"}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-neutral/60 uppercase">Email Address</p>
                                        <p className="text-sm font-medium text-neutral break-all">{infoModal.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-neutral/60 uppercase">Phone</p>
                                        <p className="text-sm font-medium text-neutral">{infoModal.phone || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-neutral/60 uppercase">Date of Birth</p>
                                        <p className="text-sm font-medium text-neutral">{infoModal.DOB || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-neutral/60 uppercase">Joined</p>
                                        <p className="text-sm font-medium text-neutral">{infoModal.createdAt ? new Date(infoModal.createdAt).toLocaleDateString() : "Unknown"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Booking History rendering */}
                        <div className="mt-2">
                            <CustomerBookings email={infoModal.email} />
                        </div>
                        <div className="modal-action mt-6 pt-4 border-t border-base-200">
                            <button className="btn btn-outline" onClick={() => setInfoModal(null)}>Close</button>
                        </div>
                    </div>
                    <div className="modal-backdrop bg-black/20" onClick={() => setInfoModal(null)}></div>
                </dialog>
            )}
        </div>
    );
};

export default Customers;