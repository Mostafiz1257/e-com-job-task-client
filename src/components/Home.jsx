import { useGetProductsQuery, useAddToCartMutation } from "../redux/api/baseApi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { currentUser } from "../redux/features/auth/authSlice";
import { toast } from "sonner"; // For notifications
import { useState } from "react";

const Home = () => {
  const { data, error, isLoading } = useGetProductsQuery();
  const navigate = useNavigate();
  const user = useAppSelector(currentUser);
  const userId = user?._id;

  // Add to cart mutation
  const [addToCart] = useAddToCartMutation();

  // State to track which product is being added
  const [addingProducts, setAddingProducts] = useState({});

  const handleAddToCart = async (productId) => {
    if (!userId) {
      toast.error("Please login to add products to cart.");
      return;
    }

    // Set the state to show that this product is being added
    setAddingProducts((prev) => ({
      ...prev,
      [productId]: true,
    }));

    try {
      const product = {
        productId,
        quantity: 1,
      };
      await addToCart({ product, userId }).unwrap();
      toast.success("Product added to cart!");
    } catch (err) {
      toast.error("Failed to add product to cart.");
    } finally {
      // Reset the adding state for this product after the request
      setAddingProducts((prev) => ({
        ...prev,
        [productId]: false,
      }));
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`); // Navigate to product details page
  };

  if (isLoading) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-xl text-red-600">
        Something went wrong while fetching the products!
      </p>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4">Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.data?.map((product) => (
          <div
            key={product.id} // Use _id here for unique key
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            {/* Product Title */}
            <h2 className="text-lg font-semibold">{product.title}</h2>
        
            <p className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</p>
            {/* Buttons */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleViewDetails(product.id)} // Navigate to details page using _id
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-200"
              >
                View Details
              </button>
              <button
                onClick={() => handleAddToCart(product._id)} // Add to cart on click
                className={`${
                  addingProducts[product._id] ? "bg-gray-400" : "bg-green-600"
                } text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-200`}
                disabled={addingProducts[product._id]} // Disable button if it's being added
              >
                {addingProducts[product._id] ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
