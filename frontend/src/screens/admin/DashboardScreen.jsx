import { Link } from 'react-router-dom';
import { useGetDashboardStatsQuery } from '../../slices/ordersApiSlice';
import { useGetAdminProductsQuery } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaShoppingBag, FaUsers, FaBox, FaRupeeSign, FaChevronRight, FaArrowUp } from 'react-icons/fa';

const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <div className="p-8"><Loader /></div>;
  if (error) return <div className="p-8"><Message variant="danger">{error?.data?.message}</Message></div>;

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: FaRupeeSign, color: 'bg-green-500', change: '+12.5%' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FaShoppingBag, color: 'bg-blue-500', change: '+8.2%' },
    { label: 'Total Products', value: stats.totalProducts, icon: FaBox, color: 'bg-purple-500', change: '+3.1%' },
    { label: 'Total Users', value: stats.totalUsers, icon: FaUsers, color: 'bg-orange-500', change: '+15.4%' },
  ];

  // Build simple bar chart from monthlyRevenue
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const maxRevenue = Math.max(...(stats.monthlyRevenue?.map((m) => m.revenue) || [1]));

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card p-5 flex items-start gap-4">
            <div className={`${color} p-3 rounded-lg flex-shrink-0`}>
              <Icon className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold dark:text-white">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
              <p className="text-xs text-green-600 flex items-center gap-0.5 mt-1"><FaArrowUp size={9} />{change} this month</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly revenue bar chart */}
        <div className="card p-5">
          <h2 className="font-bold dark:text-white mb-5">Monthly Revenue (Last 6 Months)</h2>
          {stats.monthlyRevenue?.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No revenue data yet. Start selling!</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {stats.monthlyRevenue.map((m) => {
                const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={`${m._id.year}-${m._id.month}`} className="flex flex-col items-center flex-1 gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">₹{(m.revenue/1000).toFixed(0)}k</span>
                    <div
                      className="w-full bg-amazon rounded-t-sm transition-all duration-500 hover:bg-amazon-dark relative group"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                        ₹{m.revenue.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{months[m._id.month - 1]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold dark:text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-amazon text-xs hover:underline flex items-center gap-1">
              View All <FaChevronRight size={10} />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="w-8 h-8 rounded-full bg-amazon flex items-center justify-center text-amazon-blue-dark font-bold text-xs flex-shrink-0">
                  {order.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium dark:text-white truncate">{order.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{order.orderItems.length} items · {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  <span className={`text-xs badge ${
                    order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{order.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Manage Products', to: '/admin/products', color: 'from-purple-500 to-purple-700' },
          { label: 'Manage Orders', to: '/admin/orders', color: 'from-blue-500 to-blue-700' },
          { label: 'Manage Users', to: '/admin/users', color: 'from-green-500 to-green-700' },
        ].map(({ label, to, color }) => (
          <Link key={label} to={to}
            className={`bg-gradient-to-r ${color} text-white rounded-lg p-4 font-semibold text-sm flex items-center justify-between hover:opacity-90 transition-opacity`}>
            {label} <FaChevronRight size={14} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardScreen;
