import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Api from "../utils/Api";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ suspended }) => (
    <span
        className={`px-2 py-0.5 rounded text-xs font-medium ${
            suspended
                ? "bg-red-900/40 text-red-400"
                : "bg-green-900/40 text-green-400"
        }`}
    >
        {suspended ? "Suspended" : "Active"}
    </span>
);

// ─── User Activity Modal ──────────────────────────────────────────────────────

const ActivityModal = ({ user, onClose }) => {
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        Api.getUserActivity(user._id)
            .then((data) => {
                if (!cancelled) setActivity(data);
            })
            .catch((err) => {
                if (!cancelled)
                    setError(
                        err?.response?.data?.message || err?.message || "Failed to load activity."
                    );
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [user._id]);

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#333]">
                    <h2 className="text-lg font-semibold text-white">
                        Activity — <span className="text-[#A27B5C]">{user.username}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl leading-none"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-5 space-y-6">
                    {loading && (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-8 bg-[#2a2a2a] rounded animate-pulse" />
                            ))}
                        </div>
                    )}

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    {activity && (
                        <>
                            {/* Created Auctions */}
                            <div>
                                <h3 className="text-[#A27B5C] font-medium mb-3">
                                    Created Auctions ({activity.createdAuctions?.length ?? 0})
                                </h3>
                                {!activity.createdAuctions?.length ? (
                                    <p className="text-gray-500 text-sm">No auctions created.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-400 border-b border-[#333]">
                                                    <th className="text-left py-2 pr-4">Title</th>
                                                    <th className="text-left py-2 pr-4">Status</th>
                                                    <th className="text-left py-2">Created</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activity.createdAuctions.map((a, i) => (
                                                    <tr key={a._id ?? i} className="border-b border-[#2a2a2a]">
                                                        <td className="py-2 pr-4 text-white">{a.name ?? a.title ?? "—"}</td>
                                                        <td className="py-2 pr-4 text-gray-300">{a.status ?? "—"}</td>
                                                        <td className="py-2 text-gray-400">{formatDate(a.createdAt)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Bid History */}
                            <div>
                                <h3 className="text-[#A27B5C] font-medium mb-3">
                                    Bid History ({activity.bidHistory?.length ?? 0})
                                </h3>
                                {!activity.bidHistory?.length ? (
                                    <p className="text-gray-500 text-sm">No bids placed.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-400 border-b border-[#333]">
                                                    <th className="text-left py-2 pr-4">Product</th>
                                                    <th className="text-left py-2 pr-4">Amount</th>
                                                    <th className="text-left py-2">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activity.bidHistory.map((b, i) => (
                                                    <tr key={b._id ?? i} className="border-b border-[#2a2a2a]">
                                                        <td className="py-2 pr-4 text-white">
                                                            {b.product?.name ?? b.productName ?? "—"}
                                                        </td>
                                                        <td className="py-2 pr-4 text-[#A27B5C] font-medium">
                                                            Rs. {Number(b.amount ?? b.bidAmount ?? 0).toLocaleString()}
                                                        </td>
                                                        <td className="py-2 text-gray-400">{formatDate(b.createdAt)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Suspend Modal ────────────────────────────────────────────────────────────

const SuspendModal = ({ user, onClose, onConfirm, loading }) => {
    const [reason, setReason] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl w-full max-w-md p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Suspend User</h2>
                <p className="text-gray-400 text-sm mb-4">
                    Suspending <span className="text-[#A27B5C]">{user.username}</span>. Provide a reason (optional).
                </p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for suspension..."
                    rows={3}
                    className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-[#A27B5C] mb-4"
                />
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white border border-[#444] hover:border-[#666] transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg text-sm bg-red-700 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                    >
                        {loading ? "Suspending…" : "Suspend"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Password Reset Modal ─────────────────────────────────────────────────────

const PasswordResetModal = ({ tempPassword, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Password Reset</h2>
            <p className="text-gray-400 text-sm mb-4">
                Share this temporary password with the user. It will not be shown again.
            </p>
            <div className="bg-[#2a2a2a] border border-[#444] rounded-lg px-4 py-3 font-mono text-[#A27B5C] text-sm break-all mb-4">
                {tempPassword}
            </div>
            <button
                onClick={onClose}
                className="w-full bg-[#A27B5C] hover:bg-[#8a6548] text-white py-2 rounded-lg text-sm transition-colors"
            >
                Done
            </button>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals
    const [activityUser, setActivityUser] = useState(null);
    const [suspendUser, setSuspendUser] = useState(null);
    const [suspendLoading, setSuspendLoading] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [tempPassword, setTempPassword] = useState(null);

    const fetchUsers = useCallback(async (pg, q) => {
        setLoading(true);
        setError(null);
        try {
            const params = { page: pg, limit: 10 };
            if (q) params.search = q;
            const data = await Api.getAdminUsers(params);
            setUsers(data.data ?? data.users ?? []);
            setPagination(data.pagination ?? null);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(page, search);
    }, [fetchUsers, page, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    const handleSuspendConfirm = async (reason) => {
        setSuspendLoading(true);
        setActionError(null);
        try {
            await Api.suspendUser(suspendUser._id, reason);
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === suspendUser._id ? { ...u, isSuspended: true } : u
                )
            );
            setSuspendUser(null);
        } catch (err) {
            setActionError(err?.response?.data?.message || err?.message || "Failed to suspend user.");
        } finally {
            setSuspendLoading(false);
        }
    };

    const handleActivate = async (user) => {
        setActionError(null);
        try {
            await Api.activateUser(user._id);
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === user._id ? { ...u, isSuspended: false } : u
                )
            );
        } catch (err) {
            setActionError(err?.response?.data?.message || err?.message || "Failed to activate user.");
        }
    };

    const handleResetPassword = async (user) => {
        setActionError(null);
        try {
            const data = await Api.resetUserPassword(user._id);
            setTempPassword(data.tempPassword);
        } catch (err) {
            setActionError(err?.response?.data?.message || err?.message || "Failed to reset password.");
        }
    };

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

    const totalPages = pagination?.totalPages ?? 1;

    return (
        <>
            <Header />
            <div className="bg-black min-h-screen font-lora text-white">
                <div className="container mx-auto py-10 px-4 max-w-6xl">
                    {/* Page header */}
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold">User Management</h1>
                            <p className="text-gray-400 text-sm mt-1">
                                {pagination?.total != null ? `${pagination.total} users total` : ""}
                            </p>
                        </div>
                        <Link
                            to="/admin/dashboard"
                            className="text-sm text-[#A27B5C] hover:underline"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by username or email…"
                            className="flex-1 bg-[#212121] border border-[#333] rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#A27B5C]"
                        />
                        <button
                            type="submit"
                            className="bg-[#A27B5C] hover:bg-[#8a6548] text-white px-5 py-2 rounded-lg text-sm transition-colors"
                        >
                            Search
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                                className="border border-[#444] hover:border-[#666] text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    {/* Action error */}
                    {actionError && (
                        <div className="bg-red-900/30 border border-red-500 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                            <p className="text-red-400 text-sm">{actionError}</p>
                            <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-300 ml-4">✕</button>
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-[#212121] rounded-xl overflow-hidden">
                        {loading ? (
                            <div className="p-6 space-y-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-10 bg-[#2a2a2a] rounded animate-pulse" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center">
                                <p className="text-red-400 mb-4">{error}</p>
                                <button
                                    onClick={() => fetchUsers(page, search)}
                                    className="bg-[#A27B5C] hover:bg-[#8a6548] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : !users.length ? (
                            <p className="text-gray-500 text-center py-12">No users found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-400 border-b border-[#333]">
                                            <th className="text-left py-3 px-4">Username</th>
                                            <th className="text-left py-3 px-4">Email</th>
                                            <th className="text-left py-3 px-4">Registered</th>
                                            <th className="text-left py-3 px-4">Status</th>
                                            <th className="text-left py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, idx) => (
                                            <tr
                                                key={user._id ?? idx}
                                                className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                            >
                                                <td className="py-3 px-4 text-white font-medium">{user.username ?? "—"}</td>
                                                <td className="py-3 px-4 text-gray-300">{user.email ?? "—"}</td>
                                                <td className="py-3 px-4 text-gray-400">{formatDate(user.createdAt)}</td>
                                                <td className="py-3 px-4">
                                                    <StatusBadge suspended={user.isSuspended} />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {user.isSuspended ? (
                                                            <button
                                                                onClick={() => handleActivate(user)}
                                                                className="bg-green-800 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                                            >
                                                                Activate
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => setSuspendUser(user)}
                                                                className="bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                                            >
                                                                Suspend
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setActivityUser(user)}
                                                            className="bg-[#2a2a2a] hover:bg-[#333] border border-[#444] text-gray-300 hover:text-white px-3 py-1 rounded text-xs transition-colors"
                                                        >
                                                            View Activity
                                                        </button>
                                                        <button
                                                            onClick={() => handleResetPassword(user)}
                                                            className="bg-[#2a2a2a] hover:bg-[#333] border border-[#444] text-gray-300 hover:text-white px-3 py-1 rounded text-xs transition-colors"
                                                        >
                                                            Reset Password
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg text-sm border border-[#333] text-gray-300 hover:text-white hover:border-[#555] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-gray-400 text-sm px-2">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-lg text-sm border border-[#333] text-gray-300 hover:text-white hover:border-[#555] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />

            {/* Modals */}
            {activityUser && (
                <ActivityModal user={activityUser} onClose={() => setActivityUser(null)} />
            )}
            {suspendUser && (
                <SuspendModal
                    user={suspendUser}
                    onClose={() => setSuspendUser(null)}
                    onConfirm={handleSuspendConfirm}
                    loading={suspendLoading}
                />
            )}
            {tempPassword && (
                <PasswordResetModal
                    tempPassword={tempPassword}
                    onClose={() => setTempPassword(null)}
                />
            )}
        </>
    );
};

export default AdminUsers;
