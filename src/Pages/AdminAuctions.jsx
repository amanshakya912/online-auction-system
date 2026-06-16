import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Api from "../utils/Api";
import Helper from "../utils/Helper";

const StatusBadge = ({ status, flagged }) => {
    const colors = {
        Active: "bg-green-900/40 text-green-400",
        Available: "bg-green-900/40 text-green-400",
        Sold: "bg-blue-900/40 text-blue-400",
        Withdrawn: "bg-gray-700/40 text-gray-400",
        Ended: "bg-yellow-900/40 text-yellow-400",
    };
    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status] ?? "bg-gray-700/40 text-gray-400"}`}>
                {status ?? "Unknown"}
            </span>
            {flagged && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-900/40 text-orange-400">
                    ⚑ Flagged
                </span>
            )}
        </div>
    );
};

const TimeRemaining = ({ endTime, status }) => {
    if (status !== "Active" && status !== "Available") return <span className="text-gray-500">—</span>;
    if (!endTime) return <span className="text-gray-500">—</span>;
    const diff = new Date(endTime) - Date.now();
    if (diff <= 0) return <span className="text-red-400 text-xs">Ended</span>;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 24) return <span className="text-gray-300 text-xs">{Math.floor(h / 24)}d {h % 24}h</span>;
    return <span className="text-gray-300 text-xs">{h}h {m}m</span>;
};

const AuctionDetailModal = ({ auctionId, onClose, onEndEarly, onFlag }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [endEarlyOpen, setEndEarlyOpen] = useState(false);
    const [endReason, setEndReason] = useState("");
    const [endLoading, setEndLoading] = useState(false);
    const [flagLoading, setFlagLoading] = useState(false);
    const [actionError, setActionError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        Api.getAuctionDetails(auctionId)
            .then((data) => { if (!cancelled) setDetails(data); })
            .catch((err) => { if (!cancelled) setError(err?.response?.data?.message || "Failed to load details."); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [auctionId]);

    const handleEndEarly = async () => {
        setEndLoading(true);
        try {
            await Api.endAuctionEarly(auctionId, endReason);
            onEndEarly(auctionId);
            onClose();
        } catch (err) {
            setActionError(err?.response?.data?.message || "Failed to end auction.");
        } finally { setEndLoading(false); }
    };

    const handleFlag = async () => {
        setFlagLoading(true);
        try {
            await Api.flagAuction(auctionId);
            onFlag(auctionId);
            setDetails((prev) => prev ? { ...prev, isFlagged: true } : prev);
        } catch (err) {
            setActionError(err?.response?.data?.message || "Failed to flag auction.");
        } finally { setFlagLoading(false); }
    };

    const fmt = (d) => d ? new Date(d).toLocaleString() : "—";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-[#333]">
                    <h2 className="text-lg font-semibold text-white">Auction Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl" aria-label="Close">✕</button>
                </div>
                <div className="overflow-y-auto p-5 space-y-5">
                    {loading && <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-[#2a2a2a] rounded animate-pulse" />)}</div>}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {actionError && (
                        <div className="bg-red-900/30 border border-red-500 rounded-lg px-4 py-2 flex items-center justify-between">
                            <p className="text-red-400 text-sm">{actionError}</p>
                            <button onClick={() => setActionError(null)} className="text-red-400 ml-4">✕</button>
                        </div>
                    )}
                    {details && (
                        <>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    ["Product", details.name ?? "—"],
                                    ["Seller", details.seller?.userName ?? details.createdBy?.userName ?? "—"],
                                    ["Current Bid", `Rs. ${Number(details.currentBid ?? 0).toLocaleString()}`],
                                    ["Bid Count", details.numberOfBids ?? 0],
                                    ["End Time", fmt(details.auctionEndTime)],
                                    ["Status", details.status ?? "—"],
                                ].map(([label, val]) => (
                                    <div key={label} className="bg-[#2a2a2a] rounded-lg p-3">
                                        <p className="text-gray-400 text-xs mb-1">{label}</p>
                                        <p className="text-white">{val}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className="text-[#A27B5C] font-medium mb-3 text-sm">
                                    Active Bidders ({details.bidders?.length ?? details.activeBidders?.length ?? 0})
                                </h3>
                                {!(details.bidders?.length || details.activeBidders?.length) ? (
                                    <p className="text-gray-500 text-sm">No bidders yet.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(details.bidders ?? details.activeBidders ?? []).map((b, i) => (
                                            <span key={b._id ?? i} className="bg-[#2a2a2a] text-gray-300 px-3 py-1 rounded text-xs">
                                                {b.userName ?? b.username ?? b}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3 pt-2 border-t border-[#333]">
                                {(details.status === "Active" || details.status === "Available") && (
                                    <button onClick={() => setEndEarlyOpen(true)} className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                        End Auction Early
                                    </button>
                                )}
                                {!details.isFlagged ? (
                                    <button onClick={handleFlag} disabled={flagLoading} className="bg-orange-800 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
                                        {flagLoading ? "Flagging…" : "⚑ Flag Suspicious Activity"}
                                    </button>
                                ) : (
                                    <span className="text-orange-400 text-sm flex items-center">⚑ Already flagged</span>
                                )}
                            </div>
                            {endEarlyOpen && (
                                <div className="bg-[#2a2a2a] border border-[#444] rounded-lg p-4 space-y-3">
                                    <p className="text-white text-sm font-medium">Reason for ending early:</p>
                                    <textarea value={endReason} onChange={(e) => setEndReason(e.target.value)} placeholder="Reason (optional)…" rows={3}
                                        className="w-full bg-[#1a1a1a] border border-[#555] rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-[#A27B5C]" />
                                    <div className="flex gap-3">
                                        <button onClick={() => setEndEarlyOpen(false)} disabled={endLoading} className="px-4 py-2 rounded-lg text-sm border border-[#444] text-gray-300 hover:text-white transition-colors disabled:opacity-50">Cancel</button>
                                        <button onClick={handleEndEarly} disabled={endLoading} className="px-4 py-2 rounded-lg text-sm bg-red-700 hover:bg-red-600 text-white transition-colors disabled:opacity-50">
                                            {endLoading ? "Ending…" : "Confirm End"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAuctionId, setSelectedAuctionId] = useState(null);
    const [actionError, setActionError] = useState(null);

    const fetchAuctions = useCallback(async (pg, q) => {
        setLoading(true);
        setError(null);
        try {
            const params = { page: pg, limit: 10 };
            if (q) params.search = q;
            const data = await Api.getAdminAuctions(params);
            setAuctions(data.data ?? data.auctions ?? []);
            setPagination(data.pagination ?? null);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load auctions.");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchAuctions(page, search); }, [fetchAuctions, page, search]);

    useEffect(() => {
        const socket = io(Helper.BASE_URL);
        socket.on("bidUpdated", ({ productId, currentBid, numberOfBids }) => {
            setAuctions((prev) => prev.map((a) => a._id === productId ? { ...a, currentBid, numberOfBids } : a));
        });
        socket.on("auctionEnded", ({ productId, status }) => {
            setAuctions((prev) => prev.map((a) => a._id === productId ? { ...a, status: status ?? "Ended" } : a));
        });
        socket.on("auctionFlagged", ({ productId }) => {
            setAuctions((prev) => prev.map((a) => a._id === productId ? { ...a, isFlagged: true } : a));
        });
        return () => { socket.off("bidUpdated"); socket.off("auctionEnded"); socket.off("auctionFlagged"); socket.disconnect(); };
    }, []);

    const handleSearch = (e) => { e.preventDefault(); setPage(1); setSearch(searchInput.trim()); };
    const handleEndEarly = (id) => setAuctions((prev) => prev.map((a) => a._id === id ? { ...a, status: "Ended" } : a));
    const handleFlag = (id) => setAuctions((prev) => prev.map((a) => a._id === id ? { ...a, isFlagged: true } : a));

    const handleQuickEndEarly = async (auction) => {
        const reason = window.prompt(`End "${auction.name}" early?\n\nReason (optional):`);
        if (reason === null) return;
        try { await Api.endAuctionEarly(auction._id, reason); handleEndEarly(auction._id); }
        catch (err) { setActionError(err?.response?.data?.message || "Failed to end auction."); }
    };

    const handleQuickFlag = async (auction) => {
        try { await Api.flagAuction(auction._id); handleFlag(auction._id); }
        catch (err) { setActionError(err?.response?.data?.message || "Failed to flag auction."); }
    };

    const totalPages = pagination?.totalPages ?? 1;

    return (
        <>
            <Header />
            <div className="bg-black min-h-screen font-lora text-white">
                <div className="container mx-auto py-10 px-4 max-w-7xl">
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold">Auction Monitoring</h1>
                            <p className="text-gray-400 text-sm mt-1">{pagination?.total != null ? `${pagination.total} auctions total` : ""}</p>
                        </div>
                        <Link to="/admin/dashboard" className="text-sm text-[#A27B5C] hover:underline">← Back to Dashboard</Link>
                    </div>
                    <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by product name or seller…"
                            className="flex-1 bg-[#212121] border border-[#333] rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#A27B5C]" />
                        <button type="submit" className="bg-[#A27B5C] hover:bg-[#8a6548] text-white px-5 py-2 rounded-lg text-sm transition-colors">Search</button>
                        {search && <button type="button" onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }} className="border border-[#444] text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">Clear</button>}
                    </form>
                    {actionError && (
                        <div className="bg-red-900/30 border border-red-500 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                            <p className="text-red-400 text-sm">{actionError}</p>
                            <button onClick={() => setActionError(null)} className="text-red-400 ml-4">✕</button>
                        </div>
                    )}
                    <div className="bg-[#212121] rounded-xl overflow-hidden">
                        {loading ? (
                            <div className="p-6 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-[#2a2a2a] rounded animate-pulse" />)}</div>
                        ) : error ? (
                            <div className="p-8 text-center">
                                <p className="text-red-400 mb-4">{error}</p>
                                <button onClick={() => fetchAuctions(page, search)} className="bg-[#A27B5C] hover:bg-[#8a6548] text-white px-4 py-2 rounded-lg text-sm transition-colors">Retry</button>
                            </div>
                        ) : !auctions.length ? (
                            <p className="text-gray-500 text-center py-12">No auctions found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-400 border-b border-[#333]">
                                            <th className="text-left py-3 px-4">Product</th>
                                            <th className="text-left py-3 px-4">Seller</th>
                                            <th className="text-left py-3 px-4">Current Bid</th>
                                            <th className="text-left py-3 px-4">Bids</th>
                                            <th className="text-left py-3 px-4">Time Left</th>
                                            <th className="text-left py-3 px-4">Status</th>
                                            <th className="text-left py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auctions.map((auction, idx) => (
                                            <tr key={auction._id ?? idx} className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors">
                                                <td className="py-3 px-4 text-white font-medium max-w-[140px] truncate">{auction.name ?? "—"}</td>
                                                <td className="py-3 px-4 text-gray-300">{auction.seller?.userName ?? auction.seller?.username ?? "—"}</td>
                                                <td className="py-3 px-4 text-[#A27B5C] font-medium">Rs. {Number(auction.currentBid ?? 0).toLocaleString()}</td>
                                                <td className="py-3 px-4 text-gray-300">{auction.numberOfBids ?? 0}</td>
                                                <td className="py-3 px-4"><TimeRemaining endTime={auction.auctionEndTime} status={auction.status} /></td>
                                                <td className="py-3 px-4"><StatusBadge status={auction.status} flagged={auction.isFlagged} /></td>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button onClick={() => setSelectedAuctionId(auction._id)} className="bg-[#2a2a2a] hover:bg-[#333] border border-[#444] text-gray-300 hover:text-white px-3 py-1 rounded text-xs transition-colors">View</button>
                                                        {(auction.status === "Active" || auction.status === "Available") && (
                                                            <button onClick={() => handleQuickEndEarly(auction)} className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-xs transition-colors">End Early</button>
                                                        )}
                                                        {!auction.isFlagged && (
                                                            <button onClick={() => handleQuickFlag(auction)} className="bg-orange-900 hover:bg-orange-800 text-white px-3 py-1 rounded text-xs transition-colors">Flag</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg text-sm border border-[#333] text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
                            <span className="text-gray-400 text-sm px-2">Page {page} of {totalPages}</span>
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg text-sm border border-[#333] text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            {selectedAuctionId && (
                <AuctionDetailModal auctionId={selectedAuctionId} onClose={() => setSelectedAuctionId(null)} onEndEarly={handleEndEarly} onFlag={handleFlag} />
            )}
        </>
    );
};

export default AdminAuctions;
