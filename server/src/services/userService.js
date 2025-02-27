// backend/src/services/userService.js
import User from '../models/userModel.js';

export const fetchAllUsers = async () => {
  return await User.find();
};

export const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};
