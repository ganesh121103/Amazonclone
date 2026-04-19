import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCreatePaymentIntentMutation, usePayOrderMutation } from '../slices/ordersApiSlice';
import toast from 'react-hot-toast';
import Loader from './Loader';

// Assuming you have this env set in vite (VITE_STRIPE_PUBLISHABLE_KEY)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ amount, orderId, refetchOrder }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [payOrder] = usePayOrderMutation();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await payOrder({
          id: orderId,
          details: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: paymentIntent.receipt_email || '',
          },
        }).unwrap();
        toast.success('Payment successful!');
        refetchOrder();
      } catch (err) {
        toast.error('Payment verification failed on the server.');
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full py-2.5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? <Loader size="sm" /> : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </button>
    </form>
  );
};

const StripeCheckout = ({ amount, orderId, refetchOrder }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [createPaymentIntent, { isLoading, error }] = useCreatePaymentIntentMutation();

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const res = await createPaymentIntent({ amount }).unwrap();
        setClientSecret(res.clientSecret);
      } catch (err) {
        toast.error('Failed to initialize payment');
      }
    };
    fetchClientSecret();
  }, [amount, createPaymentIntent]);

  if (isLoading || !clientSecret) return <Loader />;
  if (error) return <div className="text-red-500">Error initializing payment</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
      <CheckoutForm amount={amount} orderId={orderId} refetchOrder={refetchOrder} />
    </Elements>
  );
};

export default StripeCheckout;
