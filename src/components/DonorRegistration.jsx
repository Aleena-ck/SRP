import React, { useState } from "react";
import { Link } from "react-router-dom";

const DonorRegistration = () => {
  const [age, setAge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(age) < 18) {
      alert("You must be at least 18 years old to register.");
      return;
    }

    alert("Form submitted successfully!");
    // You can clear the form or send data to backend here
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 bg-[#fff8f8] rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#1c0d0d]">Registration Form</h2>

      {/* Personal Details */}
      <h3 className="text-xl font-bold mb-4 underline">Personal Details</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block mb-1">Name</label>
          <input type="text" placeholder="Enter name" className="w-full p-3 rounded-md bg-[#fbeeee]" />
        </div>

        <div>
          <label className="block mb-1">Phone no</label>
          <input type="text" placeholder="Enter phone number" className="w-full p-3 rounded-md bg-[#fbeeee]" />
        </div>

        <div>
          <label className="block mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter Age"
            min="18"
            className="w-full p-3 rounded-md bg-[#fbeeee]"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input type="email" placeholder="Enter email" className="w-full p-3 rounded-md bg-[#fbeeee]" />
        </div>

        <div>
          <label className="block mb-1">Blood Group</label>
          <select className="w-full p-3 rounded-md bg-[#fbeeee]">
            <option>O+</option>
            <option>A+</option>
            <option>B+</option>
            <option>AB+</option>
            <option>O-</option>
            <option>A-</option>
            <option>B-</option>
            <option>AB-</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Guardian name</label>
          <input type="text" placeholder="Enter Guardian’s name" className="w-full p-3 rounded-md bg-[#fbeeee]" />
        </div>

        <div>
          <label className="block mb-1">Gender</label>
          <select className="w-full p-3 rounded-md bg-[#fbeeee]">
            <option>--Select Gender--</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">How are you related to Guardian?</label>
          <input type="text" placeholder="Enter relationship" className="w-full p-3 rounded-md bg-[#fbeeee]" />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1">Guardian Phone no</label>
          <input type="text" placeholder="Enter Guardian’s phone number" className="w-full p-3 rounded-md bg-[#fbeeee]" />
        </div>

        <hr className="md:col-span-2 my-10" />

      {/* College Details */}
      <h3 className="text-xl font-bold mb-4 underline md:col-span-2">College Details</h3>
      <div>
    <label className="block mb-1">State</label>
    <select className="w-full p-3 rounded-md bg-[#fbeeee]">
      <option>--Select a State--</option>
      <option>Kerala</option>
      <option>Tamil Nadu</option>
      <option>Karnataka</option>
    </select>
  </div>

  <div>
    <label className="block mb-1">District</label>
    <select className="w-full p-3 rounded-md bg-[#fbeeee]">
      <option>--Select District--</option>
      <option>Kollam</option>
      <option>Ernakulam</option>
    </select>
  </div>

  <div>
    <label className="block mb-1">College Name</label>
    <select className="w-full p-3 rounded-md bg-[#fbeeee]">
      <option>--Select College--</option>
      <option>TKM College of Engineering</option>
    </select>
  </div>

  <div>
    <label className="block mb-1">Admission Number</label>
    <input type="text" placeholder="Enter admission number" className="w-full p-3 rounded-md bg-[#fbeeee]" />
  </div>

  <div>
    <label className="block mb-1">Department</label>
    <select className="w-full p-3 rounded-md bg-[#fbeeee]">
      <option>--Select Department--</option>
      <option>Computer Science</option>
      <option>Electronics</option>
      <option>Mechanical</option>
    </select>
  </div>

      {/* Submit Button */}
        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition">
            Register
          </button>
        </div>
        
      <div className="md:col-span-2 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-red-600 hover:underline">
          Login now
        </Link>
      </div>

        
        
      </form>

    </div>
  );
};

export default DonorRegistration;
