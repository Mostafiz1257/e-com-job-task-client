import React, { useState } from "react";
// import { useSignupMutation } from "../store/api/baseApi";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
// import { verifyToken } from "../utils/verifyToken"; // Token decoding utility
// import { setUser } from "../store/slices/authSlice"; // Redux action to set user
import { Link, useNavigate } from "react-router-dom";
import { verifyToken } from "../utils/verifyToken";
import { setUser } from "../redux/features/auth/authSlice";
import { useSignupMutation } from "../redux/api/baseApi";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role:"user"
  });
  const [signup, { isLoading }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Registering...");
    try {
      const res = await signup(registerData).unwrap();
      const user = verifyToken(res.token); // Decode the token to extract user information
      dispatch(setUser({ user, token: res.token })); // Save to Redux
      toast.success("Registration successful!", { id: toastId, duration: 2000 });
      navigate("/"); // Redirect to homepage or desired page
    } catch (error) {
      toast.error(error.data?.message || "Registration failed. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Register
        </h2>
        <div className="mb-4">
          <label className="block text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={registerData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Phone</label>
          <input
            type="text"
            name="phone"
            value={registerData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Address</label>
          <input
            type="text"
            name="address"
            value={registerData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your address"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
        <Link className="text-center text-blue-500 hover:cursor-pointer" to='/login'> <p>Already have an account ? Login here</p> </Link>
      </form>
    </div>
  );
};

export default Register;
