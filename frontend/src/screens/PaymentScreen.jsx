import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

const PaymentScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  useEffect(() => {
    if (!shippingAddress?.address) navigate('/shipping');
  }, [shippingAddress, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <CheckoutSteps currentStep={3} />
      <div className="card p-6">
        <h1 className="text-xl font-bold dark:text-white mb-5">Payment Method</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {[
              { id: 'Stripe', label: 'Credit / Debit Card (Stripe)', icon: FaCreditCard, description: 'Visa, Mastercard, Amex — Secure payment via Stripe.' },
              { id: 'COD', label: 'Cash on Delivery', icon: FaMoneyBillWave, description: 'Pay when your order arrives. Available on orders up to ₹5,000.' },
            ].map(({ id, label, icon: Icon, description }) => (
              <label key={id}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors
                  ${paymentMethod === id ? 'border-amazon bg-amber-50 dark:bg-amber-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value={id} checked={paymentMethod === id}
                  onChange={() => setPaymentMethod(id)} className="mt-0.5 accent-amazon" />
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="text-amazon" size={16} />
                    <span className="font-semibold text-sm dark:text-white">{label}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                </div>
              </label>
            ))}
          </div>
          <button type="submit" className="btn-primary w-full py-2.5">Continue to Review Order →</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;
