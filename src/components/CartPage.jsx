import React from "react";
import { useGetCartQuery } from "../redux/api/baseApi";

const CartPage = () => {
  const { data, error, isLoading } = useGetCartQuery(); // Automatically uses authenticated user's ID

  if (isLoading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p>Failed to load cart: {error.message}</p>;
  }

  const cart = data?.data;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>
      {cart?.products?.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div className="grid gap-6">
          {cart?.products?.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <h2 className="text-lg font-semibold">{item.product.title}</h2>
                <p>Quantity: {item.quantity}</p>
                <p className="text-green-600 font-bold">${item.product.price}</p>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
