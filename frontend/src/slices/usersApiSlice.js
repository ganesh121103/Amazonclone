import { apiSlice } from './apiSlice';
import { logout } from './authSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({ url: '/users/login', method: 'POST', body: data }),
    }),
    register: builder.mutation({
      query: (data) => ({ url: '/users/register', method: 'POST', body: data }),
    }),
    getProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/users/profile', method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    toggleWishlist: builder.mutation({
      query: (productId) => ({ url: `/users/wishlist/${productId}`, method: 'PUT' }),
      invalidatesTags: ['User'],
    }),
    addAddress: builder.mutation({
      query: (data) => ({ url: '/users/addresses', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({ url: `/users/addresses/${addressId}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    logoutUser: builder.mutation({
      queryFn: (arg, queryApi) => {
        queryApi.dispatch(logout());
        return { data: {} };
      },
    }),
    // Admin
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/users/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useToggleWishlistMutation,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useLogoutUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
