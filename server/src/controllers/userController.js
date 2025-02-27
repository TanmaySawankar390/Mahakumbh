// backend/src/controllers/userController.js
import { fetchAllUsers, createUser as createUserService } from '../services/userService.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
