import AdminDashboardPage from "./AdminDashboardPage";

const Inventory = () => {
  const inventory = [
    { group: "A+", units: 10 },
    { group: "O-", units: 6 },
    { group: "B+", units: 8 },
    { group: "AB-", units: 3 },
  ];

  return (
    <AdminDashboardPage>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Blood Inventory</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-red-100">
          <tr>
            <th className="p-2">Blood Group</th>
            <th className="p-2">Available Units</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index} className="text-sm border-t">
              <td className="p-2 font-semibold">{item.group}</td>
              <td className="p-2">{item.units}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminDashboardPage>
  );
};

export default Inventory;
