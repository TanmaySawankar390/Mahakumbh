// backend/src/server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import navigationRoutes from "./routes/navigation.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Configure CORS for REST API and web socket communication
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware to parse JSON requests
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

// Use the user routes
app.use("/api/users", userRoutes);
app.use("/api/navigation", navigationRoutes);

// Alert endpoint: receives alert from the AI service and emits to frontend via websockets
app.post("/api/alert", (req, res) => {
  const alertPayload = req.body;

  // Add dummy IP address
  alertPayload.ip = "139.5.198.26";

  // Emit the alert message to all connected clients
  io.emit("alert", alertPayload);
  console.log("Alert emitted to frontend:", alertPayload);

  res.status(200).json({ message: "Alert sent to frontend" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A client connected via websockets:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
