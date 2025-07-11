import { useState } from 'react';

function Profile() {
  const [user, setUser] = useState({
    name: 'Aleena CK',
    bloodGroup: 'O+',
    contact: '9876543210',
    photo: 'https://via.placeholder.com/100',
    email: 'aleena@example.com',
    age: 21,
    address: 'Kollam, Kerala',
  });

  const donationHistory = [
    { date: '2024-08-12', units: 1, location: 'Govt Hospital' },
    { date: '2025-01-05', units: 1, location: 'City Blood Bank' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Card */}
      <div className="flex items-center gap-6 bg-white shadow rounded-lg p-6">
        <img
          src={user.photo}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-red-500"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-600">Blood Group: {user.bloodGroup}</p>
          <p className="text-sm text-gray-600">Contact: {user.contact}</p>
        </div>
      </div>

      {/* Editable Details */}
      <div className="bg-white p-6 shadow rounded-lg space-y-2">
        <h3 className="text-lg font-semibold mb-2 text-red-700">Your Details</h3>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Age:</span> {user.age}</p>
        <p><span className="font-medium">Address:</span> {user.address}</p>
      </div>

      {/* Donation History */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-red-700">Donation History</h3>
        <table className="w-full text-left border">
          <thead className="bg-red-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Units Donated</th>
              <th className="p-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {donationHistory.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{entry.date}</td>
                <td className="p-2">{entry.units}</td>
                <td className="p-2">{entry.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Edit Profile
        </button>
        <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300">
          Change Password
        </button>
      </div>
    </div>
  );
}

export default Profile;
