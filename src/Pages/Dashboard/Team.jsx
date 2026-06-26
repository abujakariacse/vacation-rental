import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { ENDPOINT } from "../../config/env";
import Swal from "sweetalert2";

const Team = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [suspendModal, setSuspendModal] = useState({ isOpen: false, userId: null, reason: "" });

    const loadUsers = () => {
        setLoading(true);
        fetch(`${ENDPOINT}/users?role=admin`)
            .then((res) => res.json())
            .then((data) => {
                setTeam(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return team;
        return team.filter((c) => {
            const hay = `${c?.name || ""} ${c?.email || ""} ${c?.phone || ""} ${c?.role || ""}`.toLowerCase();
            return hay.includes(q);
        });
    }, [team, query]);

    const initials = (member) => {
        const name = member?.name || member?.displayName || "";
        if (name) {
            return name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("");
        }
        return (member?.email?.[0] || "A").toUpperCase();
    };

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
            toast.success("Team member suspended successfully");
            setSuspendModal({ isOpen: false, userId: null, reason: "" });
            loadUsers();
        },
        onError: () => toast.error("Error suspending team member"),
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
            toast.success("Team member unsuspended");
            loadUsers();
        },
        onError: () => toast.error("Error unsuspending team member"),
    });

    const makeUser = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`${ENDPOINT}/user/role/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "user" }),
            });
            if (!res.ok) throw new Error("Failed to change role");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Team member demoted to user!");
            loadUsers();
        },
        onError: () => toast.error("Error updating role"),
    });

    const busy = makeUser.isLoading || suspendUser.isLoading || unsuspendUser.isLoading;

    return (
        <div className="font-[Poppins] text-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                    <p className="text-sm font-semibold text-primary tracking-wide">Dashboard</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Team</h2>
                    <p className="text-sm text-neutral/60 mt-2">
                        All registered users with the role <span className="font-medium text-primary">admin</span>.
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
                        label: "Total Team",
                        value: team.length,
                        icon: "fa-user-tie",
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
                        value: "Admin",
                        icon: "fa-user-shield",
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
                        {query ? "No members match your search." : "No team members found."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-base-200 bg-base-100/50 backdrop-blur-xl">
                        <table className="table w-full">
                            <thead>
                                <tr className="text-neutral/70 text-xs uppercase tracking-wide border-b border-base-200">
                                    <th className="pl-5">#</th>
                                    <th>Member</th>
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
                                                    {c.role || "admin"}
                                                </span>
                                                {c.isSuspended && (
                                                    <span title={c.suspendReason} className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-semibold bg-error/10 text-error border border-error/20">
                                                        <i className="fa-solid fa-ban text-[8px]"></i> Suspended
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="dropdown dropdown-end">
                                                <label tabIndex={0} className="btn btn-ghost btn-sm m-1">
                                                    <i className="fa-solid fa-ellipsis-vertical text-neutral/70"></i>
                                                </label>
                                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl border border-base-200/60 bg-base-100/95 backdrop-blur-xl rounded-box w-48 text-left text-neutral">
                                                    <li>
                                                        <button disabled={busy} onClick={() => {
                                                            Swal.fire({
                                                                title: "Demote to User?",
                                                                text: "They will be removed from the Admin team.",
                                                                icon: "warning",
                                                                showCancelButton: true,
                                                                confirmButtonText: "Yes, demote them!"
                                                            }).then(result => {
                                                                if (result.isConfirmed) makeUser.mutate(c._id);
                                                            });
                                                        }}>
                                                            <i className="fa-solid fa-user-minus w-5 text-center text-warning"></i> Demote to User
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
                                                    {c.role || "admin"}
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
                                <div className="pt-3 border-t border-base-200/60 flex items-center justify-end gap-2">
                                    <button disabled={busy} className="btn btn-sm btn-outline text-neutral" onClick={() => {
                                        Swal.fire({
                                            title: "Demote to User?",
                                            text: "Are you sure?",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonText: "Yes, demote!"
                                        }).then(result => {
                                            if (result.isConfirmed) makeUser.mutate(c._id);
                                        });
                                    }}>
                                        <i className="fa-solid fa-user-minus"></i> Demote
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
                    Showing {filtered.length} of {team.length} member{team.length !== 1 ? "s" : ""}
                </p>
            )}

            {/* Suspend Modal */}
            {suspendModal.isOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box bg-base-100 text-base-content relative">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setSuspendModal({ isOpen: false, userId: null, reason: "" })}>✕</button>
                        <h3 className="font-bold text-lg text-error"><i className="fa-solid fa-triangle-exclamation mr-2"></i>Suspend Team Member</h3>
                        <p className="py-4 text-sm text-neutral/70">Please provide a reason for suspending this member. This action will immediately restrict their access to the system.</p>
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
        </div>
    );
};

export default Team;