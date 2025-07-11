import { useState } from 'react';
import DonorDashboardPage from "./DonorDashboardPage";

function FindBlood1() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);

  const dummyResults = [
    { name: 'City Hospital', group: 'A+', location: 'Kollam', contact: '0474-123456' },
    { name: 'John Mathew', group: 'B-', location: 'Kottayam', contact: '9999999999' },
  ];

  const handleSearch = () => {
    // Filter logic here (you can connect to backend later)
    const filtered = dummyResults.filter(
      (item) =>
        (bloodGroup ? item.group === bloodGroup : true) &&
        (location ? item.location.toLowerCase().includes(location.toLowerCase()) : true)
    );
    setResults(filtered);
  };

  return (
    <DonorDashboardPage>
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Find Blood</h2>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="border p-2 rounded w-40"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Location"
          className="border p-2 rounded flex-grow"
        />

        <button
          onClick={handleSearch}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Search
        </button>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border p-4 rounded shadow-sm bg-white"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.location}</p>
              </div>
              <p className="text-sm font-medium">{item.group}</p>
              <a
                href={`tel:${item.contact}`}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Contact
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No results found. Try a different filter.</p>
        )}
      </div>
    </div>
    </DonorDashboardPage>
  );
}

export default FindBlood1;
