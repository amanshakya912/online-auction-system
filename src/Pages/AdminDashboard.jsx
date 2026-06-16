import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Api from "../utils/Api";

const MetricCard = ({ title, value, icon, loading }) => (
    <div className="bg-[#212121] rounded-xl p-6 flex items-center gap-4">
        <div className="text-3xl text-[#A27B5C]">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            {loading ? (
                <div className="h-7 w-24 bg-[#333] rounded animate-pulse mt-1" />
            ) : (
                <p className="text-white text-2xl font-semibold">{value ?? "—"}</p>
            )}
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const colors = {
        completed: "bg-green-900/40 text-green-400",
        pending: "bg-yellow-900/40 text-yellow-400",
        failed: "bg-red-900/40 text-red-400",
        processing: "bg-blue-900/40 text-blue-400",
    };
    const cls = colors[status?.toLowerCase()] ?? "bg-gray-800 text-gray-400";
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
            {status ?? "unknown"}
        </span>
    );
};

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const fetchMetrics = useCallback(async () => {
        try {
            const data = await Api.getAdminMetrics();
            setMetrics(data);
            setError(null);
            setLastRefreshed(new Date());
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load dashboard metrics.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, [fetchMetrics]);

    const formatCurrency = (val) =>
        val != null ? `Rs. ${Number(val).toLocaleString()}` : "—";

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <>
            <Header />
            <div className="bg-black min-h-screen font-lora text-white">
                <div className="container mx-auto py-10 px-4 max-w-6xl">
                    {/* Page header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
                        <div className="flex items-center gap-4">
                            {lastRefreshed && (
                                <span className="text-gray-500 text-sm">
                                    Last updated: {lastRefreshed.toLocaleTimeString()}
                                </span>
                            )}
                            <button
                                onClick={fetchMetrics}
                                className="bg-[#A27B5C] hover:bg-[#8a6548] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div className="bg-red-900/30 border border-red-500 rounded-xl p-6 mb-8 flex items-center justify-between">
                            <p className="text-red-400">{error}</p>
                            <button
                                onClick={fetchMetrics}
                                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Metrics cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        <MetricCard
                            title="Active Auctions"
                            value={metrics?.activeAuctions}
                            icon="🏷️"
                            loading={loading}
                        />
                        <MetricCard
                            title="Total Users"
                            value={metrics?.totalUsers}
                            icon="👥"
                            loading={loading}
                        />
                        <MetricCard
                            title="Total Revenue"
                            value={formatCurrency(metrics?.totalRevenue)}
                            icon="💰"
                            loading={loading}
                        />
                    </div>

                    {/* Recent transactions */}
                    <div className="bg-[#212121] rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-[#A27B5C] mb-4">
                            Recent Transactions
                        </h2>

                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-10 bg-[#2a2a2a] rounded animate-pulse" />
                                ))}
                            </div>
                        ) : !metrics?.recentOrders?.length ? (
                            <p className="text-gray-500 text-center py-8">No recent transactions found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-400 border-b border-[#333]">
                                            <th className="text-left py-3 pr-4">Product</th>
                                            <th className="text-left py-3 pr-4">Buyer</th>
                                            <th className="text-left py-3 pr-4">Amount</th>
                                            <th className="text-left py-3 pr-4">Status</th>
                                            <th className="text-left py-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {metrics.recentOrders.map((order, idx) => (
                                            <tr
                                                key={order._id ?? idx}
                                                className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                            >
                                                <td className="py-3 pr-4 text-white">
                                                    {order.product?.name ?? order.productName ?? "—"}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-300">
                                                    {order.buyer?.username ?? order.buyerUsername ?? "—"}
                                                </td>
                                                <td className="py-3 pr-4 text-[#A27B5C] font-medium">
                                                    {formatCurrency(order.amount)}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td className="py-3 text-gray-400">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Admin nav links */}
                    <div className="mt-8 flex gap-4 flex-wrap">
                        <Link
                            to="/admin/users"
                            className="bg-[#212121] hover:bg-[#2a2a2a] border border-[#333] text-white px-5 py-2.5 rounded-lg text-sm transition-colors"
                        >
                            Manage Users
                        </Link>
                        <Link
                            to="/admin/auctions"
                            className="bg-[#212121] hover:bg-[#2a2a2a] border border-[#333] text-white px-5 py-2.5 rounded-lg text-sm transition-colors"
                        >
                            Monitor Auctions
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminDashboard;
