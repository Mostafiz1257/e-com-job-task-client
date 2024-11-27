import React, { useState } from "react";

import { toast } from "sonner";
// import { verifyToken } from "../utils/verifyToken"; // Token decoding utility
// import { setUser } from "../store/slices/authSlice"; // Redux action to set user
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/api/baseApi";
import { verifyToken } from "../utils/verifyToken";
import { setUser } from "../redux/features/auth/authSlice";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    try {
      const res = await login(loginData).unwrap();
      const user = verifyToken(res.token); // Decode user information
      dispatch(setUser({ user, token: res.token })); // Save to Redux
      toast.success("Login successful!", { id: toastId, duration: 2000 });
      navigate("/");
    } catch (error) {
      toast.error(error.data?.message || "Login failed. Please try again.", {
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
          Login
        </h2>
        <div className="mb-4">
          <p>user:m@gmail.com</p>
          <p>password:12345</p>
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
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
            value={loginData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <Link className="text-center text-blue-500 hover:cursor-pointer" to='/signup'> <p>New to sign up here</p> </Link>
    
      </form>
    </div>
  );
};

export default Login;
