import React, { useState } from "react";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "../redux/api/baseApi";
import { useAppSelector } from "../redux/hooks";
import { currentUser } from "../redux/features/auth/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const user = useAppSelector(currentUser); // Get the logged-in user
  const { data: cartData, isLoading } = useGetCartQuery(user?._id);
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCart] = useUpdateCartMutation();

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Remove item from cart
  const handleRemove = async (productId) => {
    try {
      await removeFromCart({ userId: user._id, productId }).unwrap();
     toast.success("Item removed")
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // Update quantity in cart
  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; // Prevent quantity from going below 1
    try {
      await updateCart({ userId: user._id, productId, updatedProduct: { quantity } }).unwrap();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return cartData?.data?.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
      {/* Home Button */}
      <Link
        to="/"
        className="flex items-center space-x-2 text-lg hover:bg-gray-700 px-4 py-2 rounded-md transition"
      >
        {/* <FaHome className="text-xl" /> */}
        {/* <span>Home</span> */}
      </Link>

      {/* Cart Section */}
      <div className="relative">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="flex items-center space-x-2 text-lg hover:bg-gray-700 px-4 py-2 rounded-md transition"
        >
          <FaShoppingCart className="text-xl" />
          <span>Cart</span>
        </button>

        {/* Cart Dropdown */}
        {isCartOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden z-20">
            <div className="p-4">
              {isLoading ? (
                <p>Loading cart...</p>
              ) : cartData?.data?.items.length ? (
                <>
                  {cartData.data.items.map((item) => (
                    <div
                      key={item.productId._id}
                      className="flex items-center justify-between mb-4 border-b pb-4"
                    >
                      {/* Product Image */}
                      <img
                        src={item.productId.image}
                        alt={item.productId.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />

                      {/* Product Info */}
                      <div className="flex-1 px-4">
                        <h3 className="text-lg font-semibold">{item.productId.title}</h3>
                        <p className="text-sm text-gray-600">${item.productId.price}</p>
                        <div className="flex items-center mt-2">
                          {/* Decrease Quantity */}
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId._id, item.quantity - 1)
                            }
                            className="bg-gray-300 px-2 py-1 rounded-l-md hover:bg-gray-400"
                          >
                            -
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          {/* Increase Quantity */}
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId._id, item.quantity + 1)
                            }
                            className="bg-gray-300 px-2 py-1 rounded-r-md hover:bg-gray-400"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <p
                        onClick={() => handleRemove(item.productId._id)}
                        className=" text-red-700 cursor-pointer "
                      >
                        Remove
                      </p>
                    </div>
                  ))}

                  {/* Total Price Section */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold">
                      Total Price: ${calculateTotalPrice()?.toFixed(2)}
                    </h3>
                  </div>
                </>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
