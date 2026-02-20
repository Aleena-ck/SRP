import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminDashboardPage from "./AdminDashboardPage";
import { adminAPI, bloodRequestAPI } from "../api/services";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [dashboardData, setDashboardData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboardData();
    fetchBloodRequests();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchBloodRequests = async () => {
    try {
      const response = await bloodRequestAPI.getAll({
        status: 'All',
        limit: 10
      });
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      toast.error('Failed to load blood requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await bloodRequestAPI.updateStatus(requestId, { status: newStatus });
      toast.success(`Request ${newStatus.toLowerCase()} successfully`);
      fetchBloodRequests(); // Refresh data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredRequests = requests.filter(request =>
    request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requestId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminDashboardPage>
        <div className="p-8 w-full bg-[#fff8f8] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminDashboardPage>
    );
  }

  return (
    <AdminDashboardPage>
      <div className="p-8 w-full bg-[#fff8f8] min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <h1 className="text-3xl font-bold mb-6 text-[#1c0d0d]">Dashboard</h1>

        {/* Stats Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Total Requests</h3>
              <p className="text-2xl font-bold text-red-600">{dashboardData.stats.totalRequests}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Fulfilled</h3>
              <p className="text-2xl font-bold text-green-600">{dashboardData.stats.fulfilledRequests}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Active Donors</h3>
              <p className="text-2xl font-bold text-blue-600">{dashboardData.stats.activeDonors}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Rating</h3>
              <p className="text-2xl font-bold text-yellow-600">{dashboardData.stats.rating}/5</p>
            </div>
          </div>
        )}



        {/* Table */}
        <h2 className="text-2xl font-semibold mb-4 text-[#1c0d0d]">Recent Blood Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-[#f0caca] rounded-md overflow-hidden">
            <thead>
              <tr className="bg-[#fce9e9] text-[#1c0d0d]">
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Patient Name</th>
                <th className="px-4 py-3">Blood Group</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.requestId} className="border-t border-[#f3d9d9] text-[#702f2f]">
                    <td className="px-4 py-3">{req.requestId}</td>
                    <td className="px-4 py-3">{req.patientName}</td>
                    <td className="px-4 py-3 font-semibold">{req.bloodGroup}</td>
                    <td className="px-4 py-3">{req.quantity} units</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-sm rounded-md font-medium ${getStatusClass(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <Link to={`/admin/request/${req.requestId}`} className="text-blue-600 hover:underline font-medium">
                        View
                      </Link>
                      {req.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(req.requestId, 'Approved')}
                            className="text-green-600 hover:underline font-medium"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(req.requestId, 'Cancelled')}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                    No blood requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Emergency Button */}
        <div className="mt-8 text-right">
          <Link to="/emergency-request">
            <button className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition">
              Emergency Request
            </button>
          </Link>
        </div>
      </div>
    </AdminDashboardPage>
  );
};

export default AdminDashboard;
/*import React from "react";
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


      <div className="mb-8">
        <input
          type="text"
          placeholder="Search donor by blood group..."
          className="w-full p-4 rounded-md bg-[#fbeeee] placeholder-[#a94442] text-[#a94442] outline-none"
        />
      </div>

 
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
*/