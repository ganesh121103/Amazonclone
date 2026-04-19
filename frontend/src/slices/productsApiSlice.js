import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getTopProducts: builder.query({
      query: () => '/products/top',
      providesTags: ['Product'],
    }),
    getAdminProducts: builder.query({
      query: () => '/products/admin',
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (data) => ({ url: '/products', method: 'POST', body: data }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/products/${id}/reviews`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetTopProductsQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
} = productsApiSlice;
