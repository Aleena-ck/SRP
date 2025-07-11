import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaSearch, FaPlus, FaList, FaCog } from "react-icons/fa";
import { useAuth } from "../components/AuthContext"; // Adjust path if needed
import { useNavigate } from "react-router-dom";


const DonorSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate("/login"); // redirect to login after logout
};


  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-[#fef5f5] flex flex-col justify-between px-6 py-8 border-r">
      <div>
        {/* Logo */}
        <h2 className="text-2xl font-bold text-[#1c0d0d] mb-10">Blood Bank</h2>

        {/* Menu Items */}
        <nav className="flex flex-col gap-4">
          <Link
            to="/donor-dashboard"
            className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium ${
              isActive("/donor-dashboard") ? "bg-[#fce9e9] text-[#1c0d0d]" : "text-[#522525] hover:bg-[#fce9e9]"
            }`}
          >
            <FaHome /> Dashboard
          </Link>

          <Link
            to="/find-donors"
            className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium ${
              isActive("/find-donors") ? "bg-[#fce9e9] text-[#1c0d0d]" : "text-[#522525] hover:bg-[#fce9e9]"
            }`}
          >
            <FaUser /> Find Donors
          </Link>

          <Link
            to="/find-blood1"
            className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium ${
              isActive("/find-blood") ? "bg-[#fce9e9] text-[#1c0d0d]" : "text-[#522525] hover:bg-[#fce9e9]"
            }`}
          >
            <FaSearch /> Find Blood
          </Link>

          <Link
            to="/request-blood"
            className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium ${
              isActive("/request-blood") ? "bg-[#fce9e9] text-[#1c0d0d]" : "text-[#522525] hover:bg-[#fce9e9]"
            }`}
          >
            <FaPlus /> Request Blood
          </Link>

          <Link
            to="/my-requests"
            className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium ${
              isActive("/my-requests") ? "bg-[#fce9e9] text-[#1c0d0d]" : "text-[#522525] hover:bg-[#fce9e9]"
            }`}
          >
            <FaList /> My Requests
          </Link>
        </nav>
      </div>

      {/* Bottom Items */}
      {/* Bottom Items */}
<div className="flex flex-col gap-4">
  <button
    onClick={handleLogout}
    className="flex items-center gap-3 px-4 py-2 rounded-md font-medium text-[#522525] hover:bg-[#fce9e9]"
  >
    🚪 Logout
  </button>
</div>

    </aside>
  );
};

export default DonorSidebar;
