import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage for persistence
const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'Stripe' };

const addDecimals = (num) => Math.round(num * 100) / 100;

const calcPrices = (cartItems) => {
  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(itemsPrice > 999 ? 0 : 99); // Free shipping above ₹999
  const taxPrice = addDecimals(0.18 * itemsPrice); // 18% GST
  const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { ...cartFromStorage, ...calcPrices(cartFromStorage.cartItems) },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      const prices = calcPrices(state.cartItems);
      Object.assign(state, prices);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      const prices = calcPrices(state.cartItems);
      Object.assign(state, prices);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      const prices = calcPrices([]);
      Object.assign(state, prices);
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
