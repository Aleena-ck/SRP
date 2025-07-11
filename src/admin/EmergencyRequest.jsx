import React, { useState } from "react";

const EmergencyRequest = () => {
  const [formData, setFormData] = useState({
    patient: "",
    bloodGroup: "",
    hospital: "",
    reason: "",
    neededBy: "",
    contact: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Submit data to backend or save to localStorage/temp DB
    console.log("Emergency Request Submitted:", formData);
    alert("Emergency request submitted!");
    setFormData({
      patient: "",
      bloodGroup: "",
      hospital: "",
      reason: "",
      neededBy: "",
      contact: ""
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Post Emergency Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="patient" placeholder="Patient Name" value={formData.patient} onChange={handleChange} required className="w-full p-3 border rounded" />
        <input type="text" name="bloodGroup" placeholder="Blood Group" value={formData.bloodGroup} onChange={handleChange} required className="w-full p-3 border rounded" />
        <input type="text" name="hospital" placeholder="Hospital Name" value={formData.hospital} onChange={handleChange} required className="w-full p-3 border rounded" />
        <input type="text" name="reason" placeholder="Reason for request" value={formData.reason} onChange={handleChange} required className="w-full p-3 border rounded" />
        <input type="text" name="neededBy" placeholder="Needed By (e.g. Today, 5PM)" value={formData.neededBy} onChange={handleChange} required className="w-full p-3 border rounded" />
        <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required className="w-full p-3 border rounded" />
        <button type="submit" className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700">Submit Request</button>
      </form>
    </div>
  );
};

export default EmergencyRequest;
