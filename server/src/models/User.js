import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userid: {
      type: String, // changed from ObjectId to String
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // Store GPS location as a GeoJSON Point ([longitude, latitude])
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    callPermission: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // removed _id: false to allow Mongoose to auto-generate it
);

// Create a geospatial index for efficient location queries
UserSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", UserSchema);
export default User;
