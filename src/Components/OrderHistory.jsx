import React, { useEffect, useState } from 'react';
import Api from '../utils/Api';

const STATUS_STYLES = {
    pending:   'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    paid:      'bg-green-500/20 text-green-400 border border-green-500/30',
    shipped:   'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    delivered: 'bg-green-600/20 text-green-300 border border-green-600/30',
    cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${style}`}>
            {status}
        </span>
    );
};

const OrderDetailModal = ({ orderId, onClose }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await Api.getOrderById(orderId);
                setOrder(data.order || data);
            } catch (err) {
                setError('Failed to load order details.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4">
            <div className="bg-[#242628] rounded-2xl shadow-xl w-full max-w-lg text-white">
                <div className="flex items-center justify-between p-6 border-b border-[#3a3a3a]">
                    <h2 className="text-xl font-semibold">Order Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-6">
                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-2 border-[#A27B5C] border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    {error && <p className="text-red-400 text-center py-4">{error}</p>}
                    {order && !loading && (
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Order ID</span>
                                <span className="font-mono text-xs">{order._id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Product</span>
                                <span>{order.product?.name || order.productName || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Amount</span>
                                <span className="text-[#A27B5C] font-semibold">
                                    Rs. {(order.amount || order.totalAmount || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Status</span>
                                <StatusBadge status={order.status} />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Date</span>
                                <span>{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            {order.shippingAddress && (
                                <div className="pt-2 border-t border-[#3a3a3a]">
                                    <p className="text-gray-400 mb-2">Shipping Address</p>
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            )}
                            {order.transactionId && (
                                <div className="flex justify-between pt-2 border-t border-[#3a3a3a]">
                                    <span className="text-gray-400">Transaction ID</span>
                                    <span className="font-mono text-xs truncate max-w-[200px]">{order.transactionId}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full bg-[#A27B5C] hover:bg-[#8a6449] text-white py-2 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await Api.getOrders({ page, limit: 10 });
                setOrders(data.orders || data.data || []);
                if (data.pagination) {
                    setPagination(data.pagination);
                } else {
                    setPagination({ currentPage: page, totalPages: 1, total: (data.orders || data.data || []).length });
                }
            } catch (err) {
                setError('Failed to load orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [page]);

    const truncateId = (id) => id ? `${id.slice(0, 8)}...` : '—';

    return (
        <div className="bg-[#242628] p-8 rounded-2xl text-white mt-10">
            <h3 className="text-xl font-semibold border-b border-[#AD8B73] pb-2 mb-6">Order History</h3>

            {loading && (
                <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-2 border-[#A27B5C] border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {error && !loading && (
                <div className="text-center py-8">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => setPage(1)}
                        className="bg-[#A27B5C] hover:bg-[#8a6449] text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && orders.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-lg mb-2">No orders yet</p>
                    <p className="text-sm">Your order history will appear here after you complete a purchase.</p>
                </div>
            )}

            {!loading && !error && orders.length > 0 && (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-400 border-b border-[#3a3a3a]">
                                    <th className="text-left py-3 pr-4">Order ID</th>
                                    <th className="text-left py-3 pr-4">Product</th>
                                    <th className="text-left py-3 pr-4">Amount</th>
                                    <th className="text-left py-3 pr-4">Status</th>
                                    <th className="text-left py-3 pr-4">Date</th>
                                    <th className="text-left py-3">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="border-b border-[#3a3a3a] hover:bg-[#2e3032] transition-colors"
                                    >
                                        <td className="py-3 pr-4 font-mono text-xs text-gray-300">
                                            {truncateId(order._id)}
                                        </td>
                                        <td className="py-3 pr-4">
                                            {order.product?.name || order.productName || '—'}
                                        </td>
                                        <td className="py-3 pr-4 text-[#A27B5C] font-medium">
                                            Rs. {(order.amount || order.totalAmount || 0).toLocaleString()}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="py-3 pr-4 text-gray-400 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3">
                                            <button
                                                onClick={() => setSelectedOrderId(order._id)}
                                                className="text-[#A27B5C] hover:text-[#c49a72] text-xs underline transition-colors"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-[#1a1c1e] rounded-xl p-4 space-y-2"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="font-mono text-xs text-gray-400">{truncateId(order._id)}</span>
                                    <StatusBadge status={order.status} />
                                </div>
                                <div className="font-medium">{order.product?.name || order.productName || '—'}</div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#A27B5C] font-semibold">
                                        Rs. {(order.amount || order.totalAmount || 0).toLocaleString()}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedOrderId(order._id)}
                                    className="text-[#A27B5C] hover:text-[#c49a72] text-xs underline transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#3a3a3a]">
                            <span className="text-gray-400 text-sm">
                                Page {pagination.currentPage} of {pagination.totalPages}
                                {pagination.total ? ` · ${pagination.total} orders` : ''}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={pagination.currentPage <= 1}
                                    className="px-3 py-1 rounded-lg bg-[#1a1c1e] text-sm disabled:opacity-40 hover:bg-[#A27B5C] transition-colors disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                    disabled={pagination.currentPage >= pagination.totalPages}
                                    className="px-3 py-1 rounded-lg bg-[#1a1c1e] text-sm disabled:opacity-40 hover:bg-[#A27B5C] transition-colors disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {selectedOrderId && (
                <OrderDetailModal
                    orderId={selectedOrderId}
                    onClose={() => setSelectedOrderId(null)}
                />
            )}
        </div>
    );
};

export default OrderHistory;
