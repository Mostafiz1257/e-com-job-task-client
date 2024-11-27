import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: ["Cart", "Product", "User"],

  endpoints: (builder) => ({
    // Authentication
    signup: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
      // No need to invalidate cache, as this only affects the signup data
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      // No need to invalidate cache, as this only affects login data
    }),

    // Product Management
    getProducts: builder.query({
      query: () => "/products", // Fetch all products
      providesTags: ["Product"], // Cache this endpoint with the "Product" tag
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`, // Fetch product by ID
      providesTags: (result, error, id) => [{ type: "Product", id }], // Cache the specific product
    }),

    // Cart Management
    getCart: builder.query({
      query: (userId) => `/carts/user/${userId}`, // Get the user's current cart
      providesTags: (result, error, userId) => [{ type: "Cart", id: userId }], // Cache cart data by userId
    }),

    addToCart: builder.mutation({
      query: ({ product, userId }) => ({
        url: `/carts/user/${userId}`,
        method: "POST",
        body: product, // Add product to cart
      }),
      // Invalidates the cache for the user's cart, so it fetches updated data
      invalidatesTags: (result, error, { userId }) => [{ type: "Cart", id: userId }],
    }),

    updateCart: builder.mutation({
      query: ({ userId, productId, updatedProduct }) => ({
        url: `/carts/user/${userId}/${productId}`, // Target the specific cart and product
        method: "PUT",
        body: updatedProduct, // Send the updated product data in the body
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: "Cart", id: userId }], // Invalidate cache for the user's cart
    }),


    removeFromCart: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `/carts/user/${userId}/${productId}`,
        method: "DELETE", // Remove product from cart
      }),
      // Invalidates the cache for the user's cart, so it fetches updated data
      invalidatesTags: (result, error, { userId }) => [{ type: "Cart", id: userId }],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
} = baseApi;
