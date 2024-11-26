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
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Product Management
    getProducts: builder.query({
      query: () => "/products", // Fetch all products
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`, // Fetch product by ID
    }),

    // Cart Management
    getCart: builder.query({
      query: () => "/carts/user", // Get the user's current cart
    }),

    addToCart: builder.mutation({
      query: (product) => ({
        url: "/carts/user",
        method: "POST",
        body: product, // Add product to cart
      }),
    }),

    updateCart: builder.mutation({
      query: (updatedProduct) => ({
        url: "/carts/user",
        method: "PUT",
        body: updatedProduct, // Update product quantity in cart
      }),
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/carts/user/${productId}`,
        method: "DELETE", // Remove product from cart
      }),
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
