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
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaSave, FaImage } from 'react-icons/fa';

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
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-slide-up-fade">
        <div>
          <h1 className="text-3xl font-black dark:text-white tracking-tight">Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage store products and stock.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..." 
              className="w-full sm:w-64 pl-10 py-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amazon focus:bg-white dark:focus:bg-gray-900 transition-all shadow-sm" />
          </div>
          <button onClick={openCreate} className="px-5 py-2.5 bg-amazon hover:bg-amazon-dark text-amazon-blue-dark font-bold rounded-full flex items-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(255,153,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,153,0,0.23)] hover:-translate-y-0.5 transition-all">
            <FaPlus size={12} /> Add Product
          </button>
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
                  <th className="px-6 py-4 text-left border-b border-gray-100 dark:border-gray-700/50">Product</th>
                  <th className="px-6 py-4 text-left border-b border-gray-100 dark:border-gray-700/50">Category</th>
                  <th className="px-6 py-4 text-right border-b border-gray-100 dark:border-gray-700/50">Price</th>
                  <th className="px-6 py-4 text-right border-b border-gray-100 dark:border-gray-700/50">Stock</th>
                  <th className="px-6 py-4 text-right border-b border-gray-100 dark:border-gray-700/50">Rating</th>
                  <th className="px-6 py-4 text-center border-b border-gray-100 dark:border-gray-700/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filtered.map((product, i) => (
                  <tr key={product._id} className="table-row-hover group" style={{ animationDelay: `${0.1 * i}s` }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 group-hover:shadow-md transition-shadow">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-12 h-12 object-cover transition-transform group-hover:scale-110 duration-500" />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                              <FaImage size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold dark:text-white line-clamp-1 text-sm">{product.name}</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100/80 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black dark:text-white text-base">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold px-3 py-1 rounded-full text-xs ${product.countInStock > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-red-50 text-red-600 dark:bg-red-500/10'}`}>
                        {product.countInStock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 font-bold text-gray-700 dark:text-gray-300">
                        {product.rating.toFixed(1)} <span className="text-amazon">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(product)} className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center shadow-sm">
                          <FaEdit size={12} />
                        </button>
                        <button onClick={() => handleDelete(product._id, product.name)} disabled={deleting}
                          className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shadow-sm disabled:opacity-50">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16 text-gray-500 font-medium tracking-wide">No products found matching your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-700/50 text-xs font-semibold text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{filtered.length}</span> of {products?.length || 0} products
          </div>
        </div>
      )}

      {/* Glassmorphic Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity opacity-100"></div>
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transform scale-100 transition-all border-t-white/40 border-l-white/40" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
              <h2 className="text-xl font-black dark:text-white tracking-tight">{editProduct ? 'Edit Product details' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 transition-colors"><FaTimes size={14} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Product Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required placeholder="e.g. iPhone 15 Pro" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Brand *</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    required placeholder="e.g. Apple" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner form-select">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required rows={4} placeholder="Detailed product description..." className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner resize-none" />
              </div>
              
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Selling Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required min="0" placeholder="0" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner font-mono text-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    min="0" placeholder="0 (MRP)" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner font-mono text-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Stock Qty *</label>
                  <input type="number" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })}
                    required min="0" placeholder="0" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner font-mono text-lg" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Image URL *</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input value={form.images[0]?.url} onChange={(e) => setForm({ ...form, images: [{ public_id: 'custom', url: e.target.value }] })}
                      required placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amazon focus:outline-none dark:text-white transition-all shadow-inner" />
                  </div>
                  {form.images[0]?.url && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm flex-shrink-0">
                      <img src={form.images[0].url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" id="featured" checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 checked:bg-amazon checked:border-amazon transition-colors cursor-pointer" />
                  <div className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 block" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <label htmlFor="featured" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer select-none">Show on Homepage as Featured Product</label>
              </div>
              
              <div className="flex gap-4 justify-end pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-full font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={creating || updating}
                  className="px-8 py-2.5 bg-amazon hover:bg-amazon-dark text-amazon-blue-dark font-bold rounded-full flex items-center gap-2 shadow-[0_4px_14px_0_rgba(255,153,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,153,0,0.23)] transition-all">
                  {(creating || updating) ? <div className="w-4 h-4 border-2 border-amazon-blue-dark border-t-transparent rounded-full animate-spin" /> : <FaSave size={16} />}
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
