// src/routes/navigation.js
import express from 'express';
import { getSafeRoute } from '../controllers/navigationController.js';

const router = express.Router();

// GET endpoint to retrieve safe zone information based on user's location
router.get('/safeway', getSafeRoute);

export default router;
