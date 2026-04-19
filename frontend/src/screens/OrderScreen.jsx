import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetOrderByIdQuery } from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import StripeCheckout from '../components/StripeCheckout';
import { FaCheckCircle, FaTimesCircle, FaTruck, FaBox, FaReceipt } from 'react-icons/fa';

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusIcons = { Processing: FaBox, Shipped: FaTruck, Delivered: FaCheckCircle, Cancelled: FaTimesCircle };

const OrderScreen = () => {
  const { id } = useParams();
  const { data: order, isLoading, error, refetch } = useGetOrderByIdQuery(id);
  const { userInfo } = useSelector((state) => state.auth);

  if (isLoading) return <div className="max-w-5xl mx-auto px-4 py-10"><Loader /></div>;
  if (error) return <div className="max-w-5xl mx-auto px-4 py-10"><Message variant="danger">{error?.data?.message}</Message></div>;

  const StatusIcon = statusIcons[order.orderStatus] || FaBox;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FaReceipt className="text-amazon" size={22} />
        <h1 className="text-xl font-bold dark:text-white">Order Details</h1>
        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
          #{order._id}
        </code>
        <span className={`ml-auto badge px-3 py-1.5 flex items-center gap-1.5 ${statusColors[order.orderStatus]}`}>
          <StatusIcon size={12} /> {order.orderStatus}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Shipping */}
          <div className="card p-5">
            <h2 className="font-bold dark:text-white mb-3 flex items-center gap-2"><FaTruck className="text-amazon" /> Shipping</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 grid sm:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold dark:text-white mb-1">Deliver to:</p>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>📞 {order.shippingAddress.phone}</p>
              </div>
              <div>
                <p className="font-semibold dark:text-white mb-1">Customer:</p>
                <p>{order.user?.name}</p>
                <p className="text-amazon">{order.user?.email}</p>
              </div>
            </div>
            <div className="mt-3">
              {order.isDelivered ? (
                <Message variant="success">✅ Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</Message>
              ) : (
                <Message variant="warning">🚚 {order.orderStatus === 'Shipped' ? 'Your package is on its way' : 'Not yet shipped'}</Message>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h2 className="font-bold dark:text-white mb-3">Payment</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Method: <span className="font-semibold dark:text-white">{order.paymentMethod}</span></p>
            {order.isPaid ? (
              <Message variant="success">✅ Paid on {new Date(order.paidAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</Message>
            ) : (
              <Message variant="danger">❌ Not yet paid</Message>
            )}

            {!order.isPaid && order.paymentMethod === 'Stripe' && userInfo._id === order.user?._id && (
              <div className="mt-4">
                <StripeCheckout amount={order.totalPrice} orderId={order._id} refetchOrder={refetch} />
              </div>
            )}
          </div>

          {/* Items */}
          <div className="card p-5">
            <h2 className="font-bold dark:text-white mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.product} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-lg bg-gray-50 dark:bg-gray-700" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product}`} className="text-sm font-medium hover:text-amazon dark:text-white line-clamp-1">{item.name}</Link>
                    <p className="text-xs text-gray-500">{item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="font-semibold text-sm dark:text-white flex-shrink-0">₹{(item.qty * item.price).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-5 sticky top-20">
            <h2 className="font-bold dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              {[
                ['Items', `₹${order.itemsPrice.toLocaleString('en-IN')}`],
                ['Shipping', order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`],
                ['Tax (GST)', `₹${order.taxPrice.toLocaleString('en-IN')}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between font-bold text-base dark:text-white">
                <span>Total</span>
                <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Order placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
