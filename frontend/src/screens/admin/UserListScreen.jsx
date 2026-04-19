import { useState } from 'react';
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../slices/usersApiSlice';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaSearch, FaShieldAlt, FaUser, FaCheckCircle, FaTimes, FaSave } from 'react-icons/fa';

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Users</h1>
        <div className="ml-auto relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..." className="input-field pl-9 py-2 w-56 text-sm" />
        </div>
      </div>

      {isLoading ? <Loader /> : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                <tr>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amazon flex items-center justify-center text-amazon-blue-dark font-bold text-sm flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.isAdmin ? (
                        <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 flex items-center gap-1 w-fit">
                          <FaShieldAlt size={10} /> Admin
                        </span>
                      ) : (
                        <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center gap-1 w-fit">
                          <FaUser size={10} /> User
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(user)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                          <FaEdit size={14} />
                        </button>
                        {user._id !== userInfo?._id && (
                          <button onClick={() => handleDelete(user._id, user.name)} disabled={deleting}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-500">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
            {filtered.length} of {users?.length || 0} users · {(users || []).filter((u) => u.isAdmin).length} admins
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setEditUser(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold dark:text-white">Edit User</h2>
              <button onClick={() => setEditUser(null)} className="hover:text-red-500"><FaTimes size={16} /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required className="input-field" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isAdmin" checked={editForm.isAdmin}
                  onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                  className="accent-amazon w-4 h-4" />
                <label htmlFor="isAdmin" className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <FaShieldAlt className="text-purple-500" size={12} /> Grant Admin Privileges
                </label>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setEditUser(null)} className="btn-secondary text-sm">Cancel</button>
                <button type="submit" disabled={updating} className="btn-primary flex items-center gap-2 text-sm">
                  {updating ? <div className="w-4 h-4 border-2 border-amazon-blue-dark border-t-transparent rounded-full animate-spin" /> : <FaSave size={14} />}
                  Update User
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
