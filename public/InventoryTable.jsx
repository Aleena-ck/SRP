import { useState } from 'react';

function InventoryTable() {
  const [inventory, setInventory] = useState([
    { id: 1, bloodGroup: 'A+', units: 10, expiry: '2025-08-10' },
    { id: 2, bloodGroup: 'O-', units: 5, expiry: '2025-07-25' },
  ]);

  const handleEdit = (id) => {
    alert(`Edit stock with ID ${id}`);
    // Add actual edit logic later
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const handleAddStock = () => {
    alert('Add new stock form to appear');
    // Add form/modal logic
  };

  const handleExport = () => {
    alert('Exporting data as CSV or PDF');
    // Implement real export functionality
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-700">Blood Inventory</h2>
        <div className="space-x-3">
          <button
            onClick={handleAddStock}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            + Add Stock
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Export Data
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-red-100">
            <tr>
              <th className="px-4 py-2">Blood Group</th>
              <th className="px-4 py-2">Units</th>
              <th className="px-4 py-2">Expiry Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.bloodGroup}</td>
                  <td className="px-4 py-2">{item.units}</td>
                  <td className="px-4 py-2">{item.expiry}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No inventory records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTable;
