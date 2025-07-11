// backend/models/Donor.js
const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  age: Number,
  email: { type: String, unique: true },
  bloodGroup: String,
  guardianName: String,
  gender: String,
  guardianRelation: String,
  guardianPhone: String,

  // College details
  state: String,
  district: String,
  college: String,
  admissionNumber: String,
  department: String,

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Donor", donorSchema);
