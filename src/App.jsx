import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// header buttons   
import Header from "./common/Header";
import Home from "./components/Home";
import LearnMore from "./components/LearnMore";
import AdminRegistration from "./components/AdminRegistration";
import DonorRegistration from "./components/DonorRegistration";
import DonorLogin from "./components/DonorLogin";
import Footer from "./common/Footer";

// after login
import AdminDashboard from "./admin/AdminDashboard";
import DonorDashboard from "./donor/DonorDashboard";

// admin sidebar
import EmergencyRequest from "./admin/EmergencyRequest";
import Donors from "./admin/Donors";
import Requests from "./admin/Requests";
import Inventory from "./admin/Inventory";

// donor sidebar
import FindDonors from "./donor/FindDonors"; 
import FindBlood1 from "./donor/FindBlood1";
import RequestBlood from "./donor/RequestBlood";
import MyRequests from "./donor/MyRequests";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        {/* Main Content Area */}
        <div className="flex-grow ">
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/admin-registration" element={<AdminRegistration />} />
            <Route path="/register" element={<DonorRegistration />} />
            <Route path="/login" element={<DonorLogin />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/emergency-request" element={<EmergencyRequest />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/inventory" element={<Inventory />} />

            <Route path="/donor-dashboard" element={<DonorDashboard />} />
            <Route path="/find-donors" element={<FindDonors />} />
            <Route path="/find-blood1" element={<FindBlood1 />} />
            <Route path="/request-blood" element={<RequestBlood />} />
            <Route path="/my-requests" element={<MyRequests />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
