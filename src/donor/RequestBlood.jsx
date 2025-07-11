import { useState } from 'react';
import DonorDashboardPage from "./DonorDashboardPage";

function RequestBlood() {
  const [form, setForm] = useState({
    name: '',
    bloodGroup: '',
    units: '',
    hospital: '',
    contact: '',
    emergency: 'Normal',
    reason: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', form);
    alert("Request submitted successfully!");
    // Add logic to send form data to backend
  };

  return (
    <DonorDashboardPage>
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-700">Request Blood</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />

        <select
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>

        <input
          type="number"
          name="units"
          placeholder="Required Units"
          value={form.units}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />

        <input
          type="text"
          name="hospital"
          placeholder="Hospital Name"
          value={form.hospital}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />

        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={form.contact}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />

        <select
          name="emergency"
          value={form.emergency}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
        >
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
        </select>

        <textarea
          name="reason"
          placeholder="Notes / Reason"
          value={form.reason}
          onChange={handleChange}
          rows="3"
          className="w-full border rounded px-4 py-2"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Submit Request
        </button>
      </form>
    </div>
    </DonorDashboardPage>
  );
}

export default RequestBlood;
