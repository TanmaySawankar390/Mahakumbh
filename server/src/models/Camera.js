const mongoose = require('mongoose');

const CameraSchema = new mongoose.Schema({
  // Optional name or identifier for the camera
  cameraName: {
    type: String,
    default: 'Unnamed Camera'
  },
  // The camera's IP address
  ipAddress: {
    type: String,
    required: true,
    unique: true,
  },
  // Camera's physical location stored as a GeoJSON Point (format: [longitude, latitude])
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    }
  },
  // Additional optional metadata
  description: {
    type: String,
  },
  // You could add fields like installationDate, status, etc.
}, { timestamps: true });

// Geospatial index for efficient queries
CameraSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Camera', CameraSchema);
