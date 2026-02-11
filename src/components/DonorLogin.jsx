import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DonorLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password, isAdmin);
      
      if (result.success) {
        toast.success('Login successful!');
        
        // Navigate based on role
        setTimeout(() => {
          if (result.user.role === 'admin') {
            navigate("/admin-dashboard");
          } else {
            navigate("/donor-dashboard");
          }
        }, 1000);
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-[#fff8f8] rounded-lg shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-[#1c0d0d]">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="relative">
          <label className="block mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none pr-10"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <span
            className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-[#a94442]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="adminCheck"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="h-4 w-4"
            disabled={loading}
          />
          <label htmlFor="adminCheck" className="text-sm text-[#522525]">
            Login as Admin
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {!isAdmin && (
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-600 hover:underline">
            Register now
          </Link>
        </div>
      )}
    </div>
  );
};

export default DonorLogin;
/*import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "./AuthContext"; // Adjust path if needed

const DonorLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Role checkbox
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Here, you would normally validate credentials via backend
    // For demo, we just log in the user with role
    const userData = {
      name: "John Doe",
      email,
      role: isAdmin ? "admin" : "donor",
    };

    login(userData); // Update auth context with role

    // Navigate to correct dashboard
    navigate(isAdmin ? "/admin-dashboard" : "/donor-dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-[#fff8f8] rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-[#1c0d0d]">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        
        <div>
          <label className="block mb-1">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        
        <div className="relative">
          <label className="block mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none pr-10"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-[#a94442]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="adminCheck"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="adminCheck" className="text-sm text-[#522525]">
            Login as Admin
          </label>
        </div>

      
        <button
          type="submit"
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition"
        >
          Login
        </button>
      </form>

      {!isAdmin && (
        <div className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-600 hover:underline">
            Register now
          </Link>
        </div>
      )}
    </div>
  );
};

export default DonorLogin;
*/