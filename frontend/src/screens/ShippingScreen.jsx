import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { FaMapMarkerAlt } from 'react-icons/fa';

const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: shippingAddress.fullName || '',
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.postalCode || '',
    state: shippingAddress.state || '',
    country: shippingAddress.country || 'India',
    phone: shippingAddress.phone || '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(form));
    navigate('/payment');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <CheckoutSteps currentStep={2} />
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <FaMapMarkerAlt className="text-amazon" size={20} />
          <h1 className="text-xl font-bold dark:text-white">Shipping Address</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'John Doe' },
            { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 9876543210' },
            { label: 'Address (House No, Street)', name: 'address', type: 'text', placeholder: '123 Main Street, Block A' },
            { label: 'City', name: 'city', type: 'text', placeholder: 'Mumbai' },
            { label: 'State', name: 'state', type: 'text', placeholder: 'Maharashtra' },
            { label: 'PIN Code', name: 'postalCode', type: 'text', placeholder: '400001' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange}
                required placeholder={placeholder} className="input-field" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
            <select name="country" value={form.country} onChange={handleChange} className="input-field">
              {['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary w-full py-2.5">Continue to Payment →</button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;
