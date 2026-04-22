import { useState } from 'react';
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../slices/usersApiSlice';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaSearch, FaShieldAlt, FaUser, FaTimes, FaSave } from 'react-icons/fa';

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', isAdmin: false });

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This is permanent.`)) return;
    try {
      await deleteUser(id).unwrap();
      toast.success(`User "${name}" deleted.`);
    } catch (err) {
      toast.error(err?.data?.message || 'Cannot delete this user');
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, isAdmin: user.isAdmin });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id: editUser._id, ...editForm }).unwrap();
      toast.success('User updated!');
      setEditUser(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  const filtered = (users || []).filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-slide-up-fade">
        <div>
          <h1 className="text-3xl font-black dark:text-white tracking-tight">User Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage platform accounts and privileges.</p>
        </div>
        
        <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..." 
            className="w-full sm:w-72 pl-10 py-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amazon focus:bg-white dark:focus:bg-gray-900 transition-all shadow-sm" />
        </div>
      </div>

      {isLoading ? <div className="flex justify-center p-12"><Loader /></div> : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <div className="glass-card animate-slide-up-fade stagger-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-gray-800/30 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left border-b border-gray-100 dark:border-gray-700/50">User Profile</th>
                  <th className="px-6 py-4 text-left border-b border-gray-100 dark:border-gray-700/50">Email</th>
                  <th className="px-6 py-4 text-left border-b border-gray-100 dark:border-gray-700/50">Role</th>
                  <th className="px-6 py-4 text-left border-b border-gray-100 dark:border-gray-700/50">Joined Date</th>
                  <th className="px-6 py-4 text-center border-b border-gray-100 dark:border-gray-700/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filtered.map((user, i) => (
                  <tr key={user._id} className="table-row-hover group" style={{ animationDelay: `${0.1 * i}s` }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0 ${user.isAdmin ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/30' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white flex items-center gap-2">
                            {user.name}
                            {user._id === userInfo?._id && <span className="bg-amazon/20 text-amazon-dark dark:text-amazon text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">You</span>}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {user._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.isAdmin ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full bg-purple-100/80 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 flex items-center gap-1.5 w-fit shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                          <FaShieldAlt size={10} /> Admin
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 flex items-center gap-1.5 w-fit">
                          <FaUser size={10} /> User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(user)}
                          className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center shadow-sm">
                          <FaEdit size={12} />
                        </button>
                        {user._id !== userInfo?._id ? (
                          <button onClick={() => handleDelete(user._id, user.name)} disabled={deleting}
                            className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shadow-sm disabled:opacity-50">
                            <FaTrash size={12} />
                          </button>
                        ) : (
                          <div className="w-8 h-8"></div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-16 text-gray-500 font-medium tracking-wide">No users found matching your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-700/50 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {filtered.length} of {users?.length || 0} users · <span className="text-purple-600 dark:text-purple-400">{(users || []).filter((u) => u.isAdmin).length} Admins</span>
          </div>
        </div>
      )}

      {/* Glassmorphic Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setEditUser(null)}>
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity opacity-100"></div>
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 w-full max-w-md overflow-hidden rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transform scale-100 transition-all border-t-white/40 border-l-white/40" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
              <h2 className="text-xl font-black dark:text-white tracking-tight">Edit Profile</h2>
              <button onClick={() => setEditUser(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 transition-colors"><FaTimes size={14} /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner" />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" id="isAdmin" checked={editForm.isAdmin}
                    onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 checked:bg-purple-600 checked:border-purple-600 transition-colors cursor-pointer" />
                  <div className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 block" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <label htmlFor="isAdmin" className="text-sm font-bold text-purple-900 dark:text-purple-300 cursor-pointer select-none flex items-center gap-2">
                  Grant Full Admin Privileges <FaShieldAlt className="text-purple-500" />
                </label>
              </div>
              
              <div className="flex gap-4 justify-end pt-4">
                <button type="button" onClick={() => setEditUser(null)} className="px-6 py-2.5 rounded-full font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={updating} 
                  className="px-8 py-2.5 bg-amazon hover:bg-amazon-dark text-amazon-blue-dark font-bold rounded-full flex items-center gap-2 shadow-[0_4px_14px_0_rgba(255,153,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,153,0,0.23)] transition-all">
                  {updating ? <div className="w-4 h-4 border-2 border-amazon-blue-dark border-t-transparent rounded-full animate-spin" /> : <FaSave size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListScreen;
