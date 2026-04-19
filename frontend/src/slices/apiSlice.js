import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base RTK Query API slice — all feature API slices inject into this
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.userInfo?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Order', 'User', 'Cart'],
  endpoints: () => ({}),
});
