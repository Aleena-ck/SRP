import AdminDashboardPage from "./AdminDashboardPage";

const Requests = () => {
  const requests = [
    { id: "REQ123", patient: "Emily Carter", group: "A+", quantity: 2, status: "Pending" },
    { id: "REQ124", patient: "David Lee", group: "O-", quantity: 1, status: "Approved" },
    { id: "REQ125", patient: "Sarah Jones", group: "B+", quantity: 3, status: "Completed" },
  ];

  return (
    <AdminDashboardPage>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Blood Requests</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-red-100">
          <tr>
            <th className="p-2">Request ID</th>
            <th className="p-2">Patient Name</th>
            <th className="p-2">Blood Group</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="text-sm border-t">
              <td className="p-2">{req.id}</td>
              <td className="p-2">{req.patient}</td>
              <td className="p-2 font-bold">{req.group}</td>
              <td className="p-2">{req.quantity} unit(s)</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  req.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                  req.status === "Approved" ? "bg-green-100 text-green-700" :
                  "bg-gray-200 text-gray-700"
                }`}>
                  {req.status}
                </span>
              </td>
              <td className="p-2 text-red-600 cursor-pointer hover:underline">View</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminDashboardPage>
  );
};

export default Requests
