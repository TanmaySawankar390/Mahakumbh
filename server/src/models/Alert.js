const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  // Reference to the camera that triggered the alert
  camera: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camera',
    required: true,
  },
  // Type of alert (e.g., "stampede", "high-crowd")
  alertType: {
    type: String,
    required: true,
  },
  // A descriptive message for the alert
  message: {
    type: String,
    required: true,
  },
  // Optional: List of user IDs who were alerted
  affectedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // Optional: Direction of the stampede if applicable (e.g., "north-east")
  stampedeDirection: {
    type: String,
  },
  // A flag to mark whether the alert has been resolved/acknowledged
  resolved: {
    type: Boolean,
    default: false,
  },
  // Timestamp is auto-generated with the schema option timestamps
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
