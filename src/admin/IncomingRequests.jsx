import { useState } from 'react';

function IncomingRequests() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      requestor: 'Rahul V.',
      bloodGroup: 'B+',
      units: 2,
      hospital: 'CityCare Hospital',
    },
    {
      id: 2,
      requestor: 'Priya S.',
      bloodGroup: 'O-',
      units: 1,
      hospital: 'Green Valley Medical',
    },
  ]);

  const handleAction = (id, action) => {
    // Just simulate the action here
    alert(`Request ${id} has been ${action}`);
    setRequests(requests.filter((req) => req.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-red-700">Incoming Blood Requests</h2>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-red-100">
            <tr>
              <th className="px-4 py-2">Requestor</th>
              <th className="px-4 py-2">Needed Blood Group</th>
              <th className="px-4 py-2">Units</th>
              <th className="px-4 py-2">Hospital</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{req.requestor}</td>
                  <td className="px-4 py-2">{req.bloodGroup}</td>
                  <td className="px-4 py-2">{req.units}</td>
                  <td className="px-4 py-2">{req.hospital}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleAction(req.id, 'Accepted')}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'Declined')}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No pending requests.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IncomingRequests;
