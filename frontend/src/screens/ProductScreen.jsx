import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductByIdQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import { useToggleWishlistMutation } from '../slices/usersApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import { FaHeart, FaShoppingCart, FaBolt, FaShieldAlt, FaTruck, FaUndo, FaStar } from 'react-icons/fa';

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data, isLoading, error, refetch } = useGetProductByIdQuery(id);
  const [createReview, { isLoading: reviewLoading }] = useCreateReviewMutation();
  const [toggleWishlist] = useToggleWishlistMutation();

  const product = data?.product;
  const recommendations = data?.recommendations || [];

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    }));
    toast.success('Added to cart!');
    navigate('/cart');
  };

  const handleBuyNow = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    }));
    navigate('/shipping');
  };

  const handleWishlist = async () => {
    if (!userInfo) { navigate('/login'); return; }
    try {
      await toggleWishlist(product._id).unwrap();
      toast.success('Wishlist updated!');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!userInfo) { navigate('/login'); return; }
    try {
      await createReview({ id, rating: reviewRating, comment: reviewComment }).unwrap();
      toast.success('Review submitted!');
      setReviewComment('');
      setShowReviewForm(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review');
    }
  };

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-10"><Loader /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-10"><Message variant="danger">{error?.data?.message || 'Product not found'}</Message></div>;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isInWishlist = userInfo?.wishlist?.includes(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span className="hover:text-amazon cursor-pointer" onClick={() => navigate('/')}>Home</span>
        {' › '}
        <span className="hover:text-amazon cursor-pointer" onClick={() => navigate(`/?category=${product.category}`)}>{product.category}</span>
        {' › '}
        <span className="text-gray-900 dark:text-gray-200 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Image gallery */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-3">
            <img
              src={product.images[selectedImage]?.url}
              alt={product.name}
              className="w-full aspect-square object-contain p-4"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-amazon' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <p className="text-xs text-amazon hover:underline cursor-pointer">{product.brand}</p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Rating value={product.rating} numReviews={product.numReviews} />
            <span className="text-xs text-gray-400">|</span>
            <span className={`text-sm font-semibold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.countInStock > 0 ? `In Stock (${product.countInStock} left)` : 'Out of Stock'}
            </span>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-gray-400 line-through text-lg">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: FaTruck, text: 'FREE Delivery', sub: 'Orders above ₹999' },
              { icon: FaShieldAlt, text: '1 Year Warranty', sub: 'Manufacturer warranty' },
              { icon: FaUndo, text: '30-Day Returns', sub: 'Hassle-free returns' },
              { icon: FaBolt, text: 'Fast Shipping', sub: '2-3 business days' },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Icon className="text-amazon flex-shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="text-xs font-semibold dark:text-white">{text}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold dark:text-white mb-1">About this item</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <span key={tag} className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div className="lg:col-span-2">
          <div className="card p-4 sticky top-20 space-y-3">
            <p className="text-xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</p>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {product.price > 999 ? 'FREE Delivery' : '+ ₹99 delivery'}
            </p>
            <p className={`text-sm font-semibold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>

            {product.countInStock > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Qty:</label>
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))}
                  className="input-field py-1 text-sm">
                  {Array.from({ length: Math.min(product.countInStock, 10) }, (_, i) => i + 1).map((x) => (
                    <option key={x} value={x}>{x}</option>
                  ))}
                </select>
              </div>
            )}

            <button onClick={handleAddToCart} disabled={product.countInStock === 0}
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <FaShoppingCart size={14} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={product.countInStock === 0}
              className="btn-secondary w-full flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <FaBolt size={14} /> Buy Now
            </button>
            <button onClick={handleWishlist}
              className="w-full flex items-center justify-center gap-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md py-2 hover:border-red-400 hover:text-red-500 transition-colors">
              <FaHeart size={14} className={isInWishlist ? 'text-red-500' : ''} />
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-12">
        <hr className="border-gray-200 dark:border-gray-700 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          {/* Rating summary */}
          <div>
            <h2 className="section-title text-lg">Customer Reviews</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl font-bold dark:text-white">{product.rating.toFixed(1)}</span>
              <div>
                <Rating value={product.rating} />
                <p className="text-sm text-gray-500">{product.numReviews} reviews</p>
              </div>
            </div>
            {userInfo ? (
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-outline text-sm w-full">
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                <span className="text-amazon hover:underline cursor-pointer" onClick={() => navigate('/login')}>Sign in</span> to write a review
              </p>
            )}

            {showReviewForm && (
              <form onSubmit={submitReview} className="mt-4 space-y-3 animate-fade-in">
                <div>
                  <label className="text-sm font-medium dark:text-white mb-1 block">Your Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewRating(s)}>
                        <FaStar className={s <= reviewRating ? 'text-amazon' : 'text-gray-300'} size={24} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-white mb-1 block">Comment</label>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                    rows={4} required placeholder="Share your thoughts..."
                    className="input-field text-sm resize-none" />
                </div>
                <button type="submit" disabled={reviewLoading} className="btn-primary w-full text-sm">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          {/* Review list */}
          <div className="md:col-span-2 space-y-4">
            {product.reviews.length === 0 ? (
              <Message variant="info">No reviews yet. Be the first to review this product!</Message>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-amazon flex items-center justify-center text-amazon-blue-dark font-bold text-sm flex-shrink-0">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm dark:text-white">{review.name}</span>
                        <Rating value={review.rating} size="text-xs" />
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendations.map((rec) => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductScreen;
