import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordFields = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* Password */}
      <div className="relative">
        <label className="block mb-1">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none pr-10"
        />
        <span
          className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-[#a94442]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* Confirm Password */}
      <div className="relative mt-4">
        <label className="block mb-1">Confirm Password</label>
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Re-enter your password"
          className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none pr-10"
        />
        <span
          className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-[#a94442]"
          onClick={() => setShowConfirm(!showConfirm)}
        >
          {showConfirm ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </>
  );
};

export default PasswordFields;
