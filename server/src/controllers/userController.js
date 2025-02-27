// backend/src/controllers/userController.js
import User from "../models/User.js";
import logger from "../utils/logger.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    logger.info(`Retrieved ${users.length} users`);
    res.json(users);
  } catch (error) {
    logger.error("Error fetching users", error);
    next(error);
  }
};

export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Basic logging of received data
    logger.info("User data received", {
      name: userData.name,
      ipAddress: userData.ipAddress,
      locationAccuracy: userData.location?.accuracy,
    });

    // Check if user exists; if so, update it
    let user = await User.findOne({ userid: userData.userid });
    if (user) {
      user.name = userData.name;
      user.location = userData.location;
      user.callPermission = userData.callPermission;
      user.ipAddress = userData.ipAddress;
      await user.save();
      logger.info("User updated successfully", { userId: user._id });
    } else {
      user = new User(userData);
      await user.save();
      logger.info("User saved successfully", { userId: user._id });
    }

    res.status(200).json({
      success: true,
      message: "User data received and saved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error processing user data", error);
    res.status(500).json({
      success: false,
      message: "Failed to process user data",
      error: error.message,
    });
  }
};
