import React from "react";
import { Link } from "react-router-dom";
import AdminDashboardPage from "./AdminDashboardPage";

const requests = [
  { id: "REQ123", name: "Emily Carter", group: "A+", qty: "2 units", status: "Pending" },
  { id: "REQ124", name: "David Lee", group: "O-", qty: "1 unit", status: "Approved" },
  { id: "REQ125", name: "Sarah Jones", group: "B+", qty: "3 units", status: "Completed" },
  { id: "REQ126", name: "Michael Brown", group: "AB+", qty: "1 unit", status: "Pending" },
  { id: "REQ127", name: "Jessica Wilson", group: "A-", qty: "2 units", status: "Approved" },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "bg-[#fce9e9] text-[#8b1c1c]";
    case "Approved":
      return "bg-[#fbeeee] text-[#2e7d32]";
    case "Completed":
      return "bg-[#f0f8f5] text-[#1a5d38]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AdminDashboard = () => {
  return (
    <AdminDashboardPage>
    <div className="p-8 w-full bg-[#fff8f8] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#1c0d0d]">Dashboard</h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search donor by blood group..."
          className="w-full p-4 rounded-md bg-[#fbeeee] placeholder-[#a94442] text-[#a94442] outline-none"
        />
      </div>

      {/* Table */}
      <h2 className="text-2xl font-semibold mb-4 text-[#1c0d0d]">Blood Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-[#f0caca] rounded-md overflow-hidden">
          <thead>
            <tr className="bg-[#fce9e9] text-[#1c0d0d]">
              <th className="px-4 py-3">Request ID</th>
              <th className="px-4 py-3">Patient Name</th>
              <th className="px-4 py-3">Blood Group</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t border-[#f3d9d9] text-[#702f2f]">
                <td className="px-4 py-3">{req.id}</td>
                <td className="px-4 py-3">{req.name}</td>
                <td className="px-4 py-3 font-semibold">{req.group}</td>
                <td className="px-4 py-3">{req.qty}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-sm rounded-md font-medium ${getStatusClass(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/admin/request/${req.id}`} className="text-red-600 hover:underline font-medium">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Emergency Button */}
      <div className="mt-8 text-right">
        <Link to="/emergency-request"><button className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition">
          Emergency Request
        </button></Link>
      </div>
    </div>
    </AdminDashboardPage>
  );
};

export default AdminDashboard;
