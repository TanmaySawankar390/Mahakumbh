import mongoose from "mongoose";
import Camera from "./models/Camera.js"; // Ensure correct path

mongoose.connect("mongodb://localhost:27017/your_database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cameras = [
  { cameraName: "Connaught Place North", ipAddress: "192.168.1.1", location: { type: "Point", coordinates: [77.2167, 28.6333] }, traffic: 120, description: "Busy commercial area." },
  { cameraName: "India Gate South", ipAddress: "192.168.1.2", location: { type: "Point", coordinates: [77.2295, 28.6129] }, traffic: 200, description: "Tourist hotspot." },
  { cameraName: "Janpath Market", ipAddress: "192.168.1.3", location: { type: "Point", coordinates: [77.2275, 28.6195] }, traffic: 90, description: "Crowded shopping area." },
  { cameraName: "Khan Market Entrance", ipAddress: "192.168.1.4", location: { type: "Point", coordinates: [77.2340, 28.6001] }, traffic: 75, description: "Upscale shopping location." },
  { cameraName: "Pragati Maidan Gate 5", ipAddress: "192.168.1.5", location: { type: "Point", coordinates: [77.2406, 28.6120] }, traffic: 110, description: "Exhibition center entry." },
  { cameraName: "Lajpat Nagar Metro Exit", ipAddress: "192.168.1.6", location: { type: "Point", coordinates: [77.2365, 28.5704] }, traffic: 250, description: "Metro station exit." },
  { cameraName: "South Extension Market", ipAddress: "192.168.1.7", location: { type: "Point", coordinates: [77.2220, 28.5705] }, traffic: 130, description: "Major shopping hub." },
  { cameraName: "Delhi Haat INA", ipAddress: "192.168.1.8", location: { type: "Point", coordinates: [77.2193, 28.5682] }, traffic: 85, description: "Cultural and food market." },
  { cameraName: "AIIMS Gate No. 2", ipAddress: "192.168.1.9", location: { type: "Point", coordinates: [77.2093, 28.5665] }, traffic: 300, description: "Hospital entrance." },
  { cameraName: "Saket Select City Walk", ipAddress: "192.168.1.10", location: { type: "Point", coordinates: [77.2265, 28.5240] }, traffic: 220, description: "Popular shopping mall." },
  { cameraName: "Qutub Minar Entry", ipAddress: "192.168.1.11", location: { type: "Point", coordinates: [77.1855, 28.5245] }, traffic: 170, description: "Historical site entrance." },
  { cameraName: "Hauz Khas Village", ipAddress: "192.168.1.12", location: { type: "Point", coordinates: [77.2004, 28.5500] }, traffic: 140, description: "Nightlife and art district." },
  { cameraName: "Dilli Haat Pitampura", ipAddress: "192.168.1.13", location: { type: "Point", coordinates: [77.1484, 28.6904] }, traffic: 95, description: "Handicrafts & food bazaar." },
  { cameraName: "Dwarka Sector 21 Metro", ipAddress: "192.168.1.14", location: { type: "Point", coordinates: [77.0732, 28.5564] }, traffic: 180, description: "Metro interchange point." },
  { cameraName: "Indira Gandhi Airport T3", ipAddress: "192.168.1.15", location: { type: "Point", coordinates: [77.0890, 28.5562] }, traffic: 500, description: "Airport terminal." },
  { cameraName: "Rajouri Garden Market", ipAddress: "192.168.1.16", location: { type: "Point", coordinates: [77.1205, 28.6452] }, traffic: 160, description: "West Delhi's shopping hub." },
  { cameraName: "Karol Bagh Ajmal Khan Rd", ipAddress: "192.168.1.17", location: { type: "Point", coordinates: [77.1915, 28.6528] }, traffic: 210, description: "Busy shopping area." },
  { cameraName: "Rashtrapati Bhavan Gate 2", ipAddress: "192.168.1.18", location: { type: "Point", coordinates: [77.2059, 28.6145] }, traffic: 50, description: "Presidential residence." },
  { cameraName: "Delhi Cantonment", ipAddress: "192.168.1.19", location: { type: "Point", coordinates: [77.1405, 28.5864] }, traffic: 100, description: "Military zone entry." },
  { cameraName: "Chandni Chowk Main Street", ipAddress: "192.168.1.20", location: { type: "Point", coordinates: [77.2303, 28.6555] }, traffic: 400, description: "Old Delhi's main market." },
  // Add remaining 35 cameras with lat/lon manually
];

const seedDatabase = async () => {
  try {
    await Camera.deleteMany(); // Clears the existing collection
    await Camera.insertMany(cameras);
    console.log("✅ Cameras inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error inserting cameras:", error);
    mongoose.connection.close();
  }
};

seedDatabase();