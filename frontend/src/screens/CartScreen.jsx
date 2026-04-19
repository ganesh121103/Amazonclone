import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaLock } from 'react-icons/fa';
import Message from '../components/Message';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((state) => state.cart);

  const updateQty = (item, newQty) => {
    if (newQty < 1) return;
    if (newQty > item.countInStock) return;
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FaShoppingCart size={80} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn-primary inline-block px-8 py-3">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold dark:text-white mb-6">
        Shopping Cart <span className="text-gray-400 text-base font-normal">({cartItems.reduce((a, c) => a + c.qty, 0)} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product} className="card p-4 flex gap-4 items-start animate-fade-in">
              <Link to={`/product/${item.product}`}>
                <img src={item.image} alt={item.name}
                  className="w-24 h-24 object-contain rounded-lg bg-gray-50 dark:bg-gray-700 flex-shrink-0 hover:scale-105 transition-transform" />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product}`}>
                  <h3 className="font-semibold text-sm sm:text-base dark:text-white hover:text-amazon transition-colors line-clamp-2">{item.name}</h3>
                </Link>
                <p className={`text-xs mt-1 font-medium ${item.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">FREE Delivery on orders above ₹999</p>

                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  {/* Qty controls */}
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item, item.qty - 1)} disabled={item.qty <= 1}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">
                      <FaMinus size={10} />
                    </button>
                    <span className="px-4 py-1 text-sm font-semibold dark:text-white min-w-[2.5rem] text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item, item.qty + 1)} disabled={item.qty >= item.countInStock}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">
                      <FaPlus size={10} />
                    </button>
                  </div>

                  {/* Delete */}
                  <button onClick={() => dispatch(removeFromCart(item.product))}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm transition-colors">
                    <FaTrash size={12} /> Remove
                  </button>

                  {/* Subtotal */}
                  <span className="ml-auto text-base font-bold dark:text-white">
                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div className="card p-5 sticky top-20">
            <h2 className="text-lg font-bold dark:text-white mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)</span>
                <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>GST (18%)</span>
                <span>₹{taxPrice.toLocaleString('en-IN')}</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between font-bold text-base dark:text-white">
                <span>Order Total</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {shippingPrice === 0 && (
              <Message variant="success" className="mt-3">
                🎉 Your order qualifies for FREE delivery!
              </Message>
            )}

            <button onClick={() => navigate('/shipping')}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3">
              <FaLock size={14} /> Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
              <FaLock size={10} /> Secure checkout with 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
