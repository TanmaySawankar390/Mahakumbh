// backend/src/server.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import navigationRoutes from './routes/navigation.js';
import cors from 'cors';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Replace default CORS config with specific origin and credentials options
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Use the user routes
app.use("/api/users", userRoutes);

app.use('/api/navigation', navigationRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
