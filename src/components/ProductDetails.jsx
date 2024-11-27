import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery, useAddToCartMutation } from "../redux/api/baseApi";
import { useAppSelector } from "../redux/hooks";
import { currentUser } from "../redux/features/auth/authSlice";
import { toast } from "sonner"; // Optional: For better user feedback

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetProductByIdQuery(id);
  console.log("_id",data?.data?._id)
  const user = useAppSelector(currentUser);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.error("You need to login to add items to the cart!");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      const product = { productId: data?.data?._id, quantity: 1 };
      await addToCart({ product, userId: user._id }).unwrap();
      toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add product to cart. Please try again!");
      console.error(error);
    }
  };

  if (isLoading) {
    return <p className="text-center text-xl">Loading product details...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-600">Something went wrong while fetching the product details!</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white max-w-4xl w-full p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img
              src={data?.data?.image}
              alt={data?.data?.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="flex flex-col justify-between">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">{data?.data?.title}</h2>
            <p className="text-lg text-gray-600 mb-4">{data?.data?.description}</p>
            <p className="text-sm text-gray-500 mb-4">Category: {data?.data?.category}</p>
            <p className="text-xl font-bold text-gray-800 mb-6">${data?.data?.price}</p>
            <div className="flex justify-between">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`${
                  isAdding ? "bg-gray-400" : "bg-green-600"
                } text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-200 shadow-md`}
              >
                {isAdding ? "Adding to Cart..." : "Add to Cart"}
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-200 shadow-md"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
