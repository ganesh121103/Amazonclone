import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import Rating from './Rating';
import toast from 'react-hot-toast';
import { FaCartPlus, FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      })
    );
    toast.success(`"${product.name.substring(0, 30)}..." added to cart!`);
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="card overflow-hidden h-full flex flex-col hover:-translate-y-1 transition-transform duration-200">
        {/* Image */}
        <div className="relative bg-gray-50 dark:bg-gray-700 aspect-square overflow-hidden">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 badge bg-red-600 text-white">
              -{discount}%
            </span>
          )}
          {/* Out of stock overlay */}
          {product.countInStock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">Out of Stock</span>
            </div>
          )}
          {/* Wishlist icon (visual only, full impl on product page) */}
          <button className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-500">
            <FaHeart size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.brand}</p>

          <Rating value={product.rating} numReviews={product.numReviews} size="text-xs" />

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {product.price > 999 ? (
            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">FREE Delivery</p>
          ) : null}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="mt-3 w-full btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCartPlus size={14} />
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
