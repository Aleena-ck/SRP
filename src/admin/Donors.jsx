import AdminDashboardPage from "./AdminDashboardPage";

const Donors = () => {
  const donors = [
    { id: "D001", name: "Alice Johnson", bloodGroup: "A+", location: "Mumbai", lastDonation: "2024-12-10" },
    { id: "D002", name: "Rahul Singh", bloodGroup: "O-", location: "Delhi", lastDonation: "2024-11-03" },
    { id: "D003", name: "Fatima Khan", bloodGroup: "B+", location: "Chennai", lastDonation: "2024-10-15" },
  ];

  return (
    <AdminDashboardPage>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Donor List</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-red-100">
          <tr>
            <th className="p-2">Donor ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Blood Group</th>
            <th className="p-2">Location</th>
            <th className="p-2">Last Donation</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor) => (
            <tr key={donor.id} className="text-sm border-t">
              <td className="p-2">{donor.id}</td>
              <td className="p-2">{donor.name}</td>
              <td className="p-2 font-bold">{donor.bloodGroup}</td>
              <td className="p-2">{donor.location}</td>
              <td className="p-2">{donor.lastDonation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminDashboardPage>
  );
};

export default Donors;
