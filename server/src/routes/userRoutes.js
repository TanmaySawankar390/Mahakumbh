// backend/src/routes/userRoutes.js
import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users - Fetch all users
router.get('/', getAllUsers);

// POST /api/users - Create a new user
router.post('/', createUser);

export default router;
