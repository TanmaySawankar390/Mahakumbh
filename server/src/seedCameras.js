import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Camera from './models/Camera.js';

// Resolve the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the project root (one directory up)
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to database');

    // Remove any existing camera records
    await Camera.deleteMany({});

    // Group 1: Exact camera record for SRM University Modinagar
    const exactCamera = {
      cameraName: 'SRM University Modinagar Main Camera',
      ipAddress: '103.255.232.110',
      location: {
        type: 'Point',
        coordinates: [77.538270, 28.796607]  // [longitude, latitude]
      },
      description: 'Main camera at SRM University Modinagar with precise coordinates.',
      traffic: 120
    };

    // Group 2: Nearby cameras for coordinate (28.796609, 77.538276)
    const baseLongitudeNearby = 77.538276;
    const baseLatitudeNearby = 28.796609;
    const nearbyCameras = [];
    const nearbyCount = 5; // Adjust the number of nearby cameras as needed

    // Use a small offset range: ±0.0001 degrees (~11 meters)
    for (let i = 0; i < nearbyCount; i++) {
      const offsetLong = (Math.random() - 0.5) * 0.0002; // ±0.0001 degrees
      const offsetLat = (Math.random() - 0.5) * 0.0002;
      nearbyCameras.push({
        cameraName: `SRM Nearby Camera ${i + 1}`,
        ipAddress: `103.255.232.${111 + i}`, // example IP addresses for nearby cameras
        location: {
          type: 'Point',
          coordinates: [baseLongitudeNearby + offsetLong, baseLatitudeNearby + offsetLat]
        },
        description: `Nearby camera ${i + 1} at SRM University Modinagar.`,
        traffic: Math.floor(Math.random() * 200) // Random traffic value between 0 and 199
      });
    }

    // Combine all camera records
    const cameras = [exactCamera, ...nearbyCameras];

    await Camera.insertMany(cameras);
    console.log('Inserted SRM University Modinagar camera data with exact and nearby records');
    process.exit();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
