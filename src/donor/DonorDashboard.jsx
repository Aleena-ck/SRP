import React from "react";
import DonorDashboardPage from "./DonorDashboardPage";

const DonorDashboard = () => {
  const donor = {
    name: "Ethan Carter",
    id: "123456",
    image: "https://i.imgur.com/l60Hf.png", // Replace with real profile image if needed
    donationHistory: [
      { date: "2023-08-15", type: "Whole Blood", location: "Community Center", status: "Completed" },
      { date: "2023-02-20", type: "Platelets", location: "Hospital", status: "Completed" },
      { date: "2022-09-10", type: "Whole Blood", location: "University", status: "Completed" },
    ],
    nextEligibility: "2024-01-15",
  };

  return (
    <DonorDashboardPage>
    <main className="flex-1 px-8 py-10 bg-[#fffafa] min-h-screen overflow-auto">
      <h1 className="text-3xl font-bold text-[#1c0d0d] mb-6">Donor Dashboard</h1>

      {/* Profile Section */}
      <div className="flex items-center gap-6 mb-10">
        <img
          src={donor.image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-[#fcdcdc]"
        />
        <div>
          <h2 className="text-2xl font-semibold text-[#1c0d0d]">{donor.name}</h2>
          <p className="text-sm text-[#a94442]">Donor ID: {donor.id}</p>
        </div>
      </div>

      {/* Donation History */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-[#1c0d0d] mb-4">Donation History</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-[#f3d7d7] rounded-md">
            <thead className="bg-[#fff1f1] text-[#a94442]">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Location</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-[#5c2c2c]">
              {donor.donationHistory.map((entry, index) => (
                <tr key={index} className="border-t border-[#f3d7d7]">
                  <td className="px-4 py-2 text-red-600">{entry.date}</td>
                  <td className="px-4 py-2">{entry.type}</td>
                  <td className="px-4 py-2">{entry.location}</td>
                  <td className="px-4 py-2">
                    <span className="bg-[#fcdcdc] text-[#1c0d0d] font-semibold px-3 py-1 rounded-lg">
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Next Eligibility */}
      <section>
        <h3 className="text-xl font-semibold text-[#1c0d0d] mb-2">Next Eligibility</h3>
        <p className="text-[#5c2c2c]">
          You are eligible to donate blood again on <strong>{donor.nextEligibility}</strong>.
        </p>
      </section>
    </main>
    </DonorDashboardPage>
  );
};

export default DonorDashboard;
