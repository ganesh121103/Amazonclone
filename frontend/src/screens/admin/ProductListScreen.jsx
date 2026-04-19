import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaSave } from 'react-icons/fa';

const CATEGORIES = ['Electronics','Computers','Smart Home','Fashion','Home & Kitchen','Books','Sports','Toys & Games','Beauty','Health','Automotive','Other'];

const EMPTY_FORM = { name: '', brand: '', category: 'Electronics', description: '', price: '', originalPrice: '', countInStock: '', isFeatured: false, images: [{ public_id: 'placeholder', url: '' }] };

const ProductListScreen = () => {
  const { data: products, isLoading, error } = useGetAdminProductsQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');

  const openCreate = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name, brand: product.brand, category: product.category,
      description: product.description, price: product.price, originalPrice: product.originalPrice,
      countInStock: product.countInStock, isFeatured: product.isFeatured,
      images: product.images?.length ? product.images : [{ public_id: 'placeholder', url: '' }],
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success(`"${name}" deleted.`);
    } catch { toast.error('Failed to delete product'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || Number(form.price),
      countInStock: Number(form.countInStock),
    };
    try {
      if (editProduct) {
        await updateProduct({ id: editProduct._id, ...body }).unwrap();
        toast.success('Product updated!');
      } else {
        await createProduct(body).unwrap();
        toast.success('Product created!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Operation failed');
    }
  };

  const filtered = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Products</h1>
        <div className="ml-auto flex gap-2 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..." className="input-field pl-9 py-2 w-56 text-sm" />
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
            <FaPlus size={12} /> Add Product
          </button>
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
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3 text-right">Rating</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]?.url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium dark:text-white line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold dark:text-white">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.countInStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{product.rating.toFixed(1)} ⭐</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(product)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleDelete(product._id, product.name)} disabled={deleting}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-500">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {products?.length || 0} products
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold dark:text-white">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:text-red-500 transition-colors"><FaTimes size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required placeholder="e.g. iPhone 15 Pro" className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand *</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    required placeholder="e.g. Apple" className="input-field text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required rows={3} placeholder="Detailed product description..." className="input-field text-sm resize-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required min="0" placeholder="0" className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    min="0" placeholder="0 (MRP)" className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Qty *</label>
                  <input type="number" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })}
                    required min="0" placeholder="0" className="input-field text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL *</label>
                <input value={form.images[0]?.url} onChange={(e) => setForm({ ...form, images: [{ public_id: 'custom', url: e.target.value }] })}
                  required placeholder="https://example.com/image.jpg" className="input-field text-sm" />
                {form.images[0]?.url && (
                  <img src={form.images[0].url} alt="Preview" className="w-20 h-20 object-cover rounded-lg mt-2 border border-gray-200 dark:border-gray-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="accent-amazon w-4 h-4" />
                <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">Mark as Featured Product</label>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-sm">Cancel</button>
                <button type="submit" disabled={creating || updating}
                  className="btn-primary flex items-center gap-2 text-sm">
                  {(creating || updating) ? <div className="w-4 h-4 border-2 border-amazon-blue-dark border-t-transparent rounded-full animate-spin" /> : <FaSave size={14} />}
                  {editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
