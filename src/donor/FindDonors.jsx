import { useState } from 'react';
import DonorDashboardPage from "./DonorDashboardPage";

function FindDonors() {
  const [filters, setFilters] = useState({
    bloodGroup: '',
    department: '',
    sort: '',
  });

  const donors = [
    { name: 'Aleena CK', bloodGroup: 'O+', department: 'CSE', lastDonated: '2025-05-20', contact: '9876543210' },
    { name: 'Roshini M', bloodGroup: 'A-', department: 'ECE', lastDonated: '2025-03-10', contact: '9876500000' },
    { name: 'Anna L', bloodGroup: 'B+', department: 'IT', lastDonated: '2025-06-01', contact: '9876511111' },
    { name: 'Khushi A', bloodGroup: 'AB+', department: 'CSE', lastDonated: '2025-04-15', contact: '9876522222' },
  ];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredDonors = donors
    .filter((d) => !filters.bloodGroup || d.bloodGroup === filters.bloodGroup)
    .filter((d) => !filters.department || d.department === filters.department)
    .sort((a, b) =>
      filters.sort === 'recent'
        ? new Date(b.lastDonated) - new Date(a.lastDonated)
        : 0
    );

  return (
    <DonorDashboardPage>
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-red-700">Find Donors</h2>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 shadow rounded-md">
        <select
          name="bloodGroup"
          value={filters.bloodGroup}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Blood Groups</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <select
          name="department"
          value={filters.department}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Departments</option>
          {["CSE", "ECE", "IT", "MECH", "CIVIL"].map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">No Sorting</option>
          <option value="recent">Sort by Recent Donation</option>
        </select>
      </div>

      {/* Donor List Grid */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-red-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Blood Group</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Last Donated</th>
              <th className="px-4 py-2">Contact</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.length > 0 ? (
              filteredDonors.map((donor, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{donor.name}</td>
                  <td className="px-4 py-2">{donor.bloodGroup}</td>
                  <td className="px-4 py-2">{donor.department}</td>
                  <td className="px-4 py-2">{donor.lastDonated}</td>
                  <td className="px-4 py-2">{donor.contact}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No donors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </DonorDashboardPage>
  );
}

export default FindDonors;
