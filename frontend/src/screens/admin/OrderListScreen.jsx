import { useState } from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaSearch, FaFilter } from 'react-icons/fa';

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleStatusChange = async (orderId, status, currentStatus) => {
    if (status === currentStatus) return;
    if (!window.confirm(`Change order status to "${status}"?`)) return;
    try {
      await updateStatus({ id: orderId, status }).unwrap();
      toast.success(`Order status updated to "${status}"`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const filtered = (orders || []).filter((o) => {
    const matchSearch = !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Orders</h1>
        <div className="ml-auto flex gap-2 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or customer..." className="input-field pl-9 py-2 w-60 text-sm" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field py-2 text-sm w-40">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex gap-2 flex-wrap mb-4">
        {STATUS_OPTIONS.map((s) => {
          const count = (orders || []).filter((o) => o.orderStatus === s).length;
          return (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              className={`badge px-3 py-1.5 text-xs cursor-pointer transition-all ${filterStatus === s ? STATUS_COLORS[s] : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
              {s}: {count}
            </button>
          );
        })}
      </div>

      {isLoading ? <Loader /> : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                <tr>
                  {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Paid', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <code className="text-xs text-gray-500 dark:text-gray-400">#{order._id.slice(-8).toUpperCase()}</code>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium dark:text-white">{order.user?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{order.orderItems.length}</td>
                    <td className="px-4 py-3 font-semibold dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {order.isPaid ? (
                        <span className="badge bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">✅ Paid</span>
                      ) : (
                        <span className="badge bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">❌ Unpaid</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value, order.orderStatus)}
                        className={`badge text-xs px-2 py-1 rounded-full border-0 cursor-pointer font-semibold ${STATUS_COLORS[order.orderStatus]}`}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/order/${order._id}`}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors inline-flex">
                        <FaEye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-10 text-gray-500">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {orders?.length || 0} orders
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;
