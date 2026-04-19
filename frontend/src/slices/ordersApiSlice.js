import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({ url: '/orders', method: 'POST', body: data }),
      invalidatesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    payOrder: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/orders/${id}/pay`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/myorders',
      providesTags: ['Order'],
    }),
    createPaymentIntent: builder.mutation({
      query: (data) => ({ url: '/payment/create-payment-intent', method: 'POST', body: data }),
    }),
    // Admin
    getAllOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/orders/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Order'],
    }),
    getDashboardStats: builder.query({
      query: () => '/orders/stats/dashboard',
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetDashboardStatsQuery,
  useCreatePaymentIntentMutation,
} = ordersApiSlice;
