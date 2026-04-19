import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProfileQuery, useUpdateProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import toast from 'react-hot-toast';
import { FaUser, FaBox, FaHeart, FaEye, FaEyeSlash, FaSave, FaCheckCircle } from 'react-icons/fa';

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ name: userInfo?.name || '', email: userInfo?.email || '', password: '', confirmPassword: '' });

  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const { data: orders, isLoading: ordersLoading } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    try {
      const body = { name: form.name, email: form.email };
      if (form.password) body.password = form.password;
      const data = await updateProfile(body).unwrap();
      dispatch(setCredentials({ ...userInfo, ...data }));
      toast.success('Profile updated!');
      setForm((f) => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'orders', label: `Orders (${orders?.length || 0})`, icon: FaBox },
    { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold dark:text-white mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
              ${activeTab === id ? 'border-amazon text-amazon' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          <div className="card p-6">
            <h2 className="font-bold dark:text-white mb-5">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password (optional)</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Leave blank to keep current" className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>
              {form.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                  <input type={showPwd ? 'text' : 'password'} value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Confirm new password" className="input-field" />
                </div>
              )}
              <button type="submit" disabled={updating} className="btn-primary flex items-center gap-2">
                {updating ? <div className="w-4 h-4 border-2 border-amazon-blue-dark border-t-transparent rounded-full animate-spin" /> : <FaSave size={14} />}
                Save Changes
              </button>
            </form>
          </div>

          <div className="card p-6">
            <h2 className="font-bold dark:text-white mb-4">Account Info</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-amazon flex items-center justify-center text-2xl font-bold text-amazon-blue-dark">
                {userInfo?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold dark:text-white">{userInfo?.name}</p>
                <p className="text-sm text-gray-500">{userInfo?.email}</p>
                {userInfo?.isAdmin && (
                  <span className="badge bg-amazon text-amazon-blue-dark mt-1">Admin</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Orders', value: orders?.length || 0 },
                { label: 'Wishlist', value: profile?.wishlist?.length || 0 },
                { label: 'Addresses', value: profile?.addresses?.length || 0 },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xl font-bold text-amazon">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders tab */}
      {activeTab === 'orders' && (
        <div className="animate-fade-in">
          {ordersLoading ? (
            <Loader />
          ) : orders?.length === 0 ? (
            <div className="text-center py-16">
              <FaBox size={60} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold dark:text-white mb-2">No orders yet</h3>
              <Link to="/" className="btn-primary inline-block mt-4">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="card p-4 flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-xs text-gray-500 dark:text-gray-400">#{order._id.slice(-8).toUpperCase()}</code>
                      <span className={`badge ${statusColors[order.orderStatus] || ''}`}>{order.orderStatus}</span>
                      {order.isPaid && <span className="badge bg-green-100 text-green-700"><FaCheckCircle size={10} className="inline mr-1" />Paid</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                      {' · '}{order.orderItems.length} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    <Link to={`/order/${order._id}`} className="text-amazon hover:underline text-sm flex items-center gap-1 justify-end mt-1">
                      <FaEye size={12} /> View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist tab */}
      {activeTab === 'wishlist' && (
        <div className="animate-fade-in">
          {profileLoading ? (
            <Loader />
          ) : profile?.wishlist?.length === 0 ? (
            <div className="text-center py-16">
              <FaHeart size={60} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold dark:text-white mb-2">Your wishlist is empty</h3>
              <Link to="/" className="btn-primary inline-block mt-4">Discover Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {profile.wishlist.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="card p-3 text-center hover:-translate-y-1 transition-transform">
                  <img src={product.images?.[0]?.url} alt={product.name} className="w-full aspect-square object-cover rounded-md mb-2" />
                  <p className="text-xs font-medium line-clamp-2 dark:text-white">{product.name}</p>
                  <p className="text-amazon font-bold text-sm mt-1">₹{product.price?.toLocaleString('en-IN')}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
