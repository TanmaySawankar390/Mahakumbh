import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Store GPS location as a GeoJSON Point ([longitude, latitude])
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
  callPermission: {
    type: Boolean,
    default: false,
  },
  ipAddress: {
    type: String,
    required: true,
  }
}, { timestamps: true });

// Create a geospatial index for efficient location queries
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', UserSchema);
