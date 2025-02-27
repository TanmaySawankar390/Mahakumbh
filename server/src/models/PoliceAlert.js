import mongoose from "mongoose";

const policeAlertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  severity: {
    type: String,
    enum: ["Low", "Moderate", "High", "Critical"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  admin: {
    adminId: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
  },
  assignedPolice: {
    policeId: { type: String, required: true },
    name: { type: String, required: true },
    rank: { type: String, required: true },
    contact: { type: String, required: true },
    policeType: { 
      type: String, 
      enum: ["Traffic", "Emergency Response", "Law Enforcement", "Special Unit"],
      required: true,
    },
    ipAddress: { 
      type: String, 
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["Pending", "Acknowledged", "In-Progress", "Resolved"],
    default: "Pending",
  },
  resolutionDetails: {
    resolvedBy: { type: String },
    resolutionTime: { type: Date },
    notes: { type: String },
  },
});

export const PoliceAlert = mongoose.model("PoliceAlert", policeAlertSchema);
