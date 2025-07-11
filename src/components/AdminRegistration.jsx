import { Link } from "react-router-dom";

const AdminRegistration = () => {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-[#fff8f8] rounded-lg shadow-md mb-10">
      <h2 className="text-3xl font-bold mb-6 text-[#1c0d0d]">Admin Registration</h2>

      <form className="space-y-4">
        <div>
          <label className="block mb-1">Organization Name</label>
          <input
            type="text"
            placeholder="Enter hospital or blood bank name"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Admin Name</label>
          <input
            type="text"
            placeholder="Enter admin name"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="Enter contact number"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Type of Center</label>
          <select className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none">
            <option>Select type</option>
            <option>Hospital</option>
            <option>Blood Bank</option>
            <option>Medical College</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Location</label>
          <input
            type="text"
            placeholder="City, District, or Area"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="w-full p-3 rounded-md bg-[#fbeeee] text-[#a94442] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition"
        >
          Register
        </button>

        <div className="mt-4 text-center text-sm">
          Already registered?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminRegistration;
