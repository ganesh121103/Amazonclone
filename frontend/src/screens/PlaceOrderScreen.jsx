import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress?.address) navigate('/shipping');
    else if (!cart.paymentMethod) navigate('/payment');
  }, [cart, navigate]);

  const handlePlaceOrder = async () => {
    try {
      const order = await createOrder({
        orderItems: cart.cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      toast.success('Order placed successfully!');
      navigate(`/order/${order._id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <CheckoutSteps currentStep={4} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Shipping */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="text-amazon" />
              <h2 className="font-bold dark:text-white">Shipping Address</h2>
              <Link to="/shipping" className="ml-auto text-xs text-amazon hover:underline">Edit</Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {cart.shippingAddress.fullName}<br />
              {cart.shippingAddress.address}<br />
              {cart.shippingAddress.city}, {cart.shippingAddress.state} - {cart.shippingAddress.postalCode}<br />
              {cart.shippingAddress.country}<br />
              📞 {cart.shippingAddress.phone}
            </p>
          </div>

          {/* Payment method */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <FaCreditCard className="text-amazon" />
              <h2 className="font-bold dark:text-white">Payment Method</h2>
              <Link to="/payment" className="ml-auto text-xs text-amazon hover:underline">Edit</Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{cart.paymentMethod}</p>
          </div>

          {/* Order items */}
          <div className="card p-5">
            <h2 className="font-bold dark:text-white mb-4">Order Items ({cart.cartItems.length})</h2>
            <div className="space-y-3">
              {cart.cartItems.map((item) => (
                <div key={item.product} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-lg bg-gray-50 dark:bg-gray-700" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product}`} className="text-sm font-medium hover:text-amazon transition-colors dark:text-white line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-sm font-semibold dark:text-white flex-shrink-0">
                    ₹{(item.qty * item.price).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order total */}
        <div>
          <div className="card p-5 sticky top-20">
            <h2 className="font-bold dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              {[
                ['Items', `₹${cart.itemsPrice.toLocaleString('en-IN')}`],
                ['Shipping', cart.shippingPrice === 0 ? 'FREE' : `₹${cart.shippingPrice}`],
                ['GST (18%)', `₹${cart.taxPrice.toLocaleString('en-IN')}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{label}</span>
                  <span className={value === 'FREE' ? 'text-green-600 font-medium' : ''}>{value}</span>
                </div>
              ))}
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between font-bold text-base dark:text-white">
                <span>Order Total</span>
                <span>₹{cart.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} disabled={isLoading || cart.cartItems.length === 0}
              className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? <Loader size="sm" text="" /> : <><FaCheckCircle size={14} /> Place Your Order</>}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              By placing your order, you agree to our Privacy Policy and Terms of Use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
