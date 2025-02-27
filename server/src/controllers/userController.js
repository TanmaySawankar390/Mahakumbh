// backend/src/controllers/userController.js

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// export const createUser = async (req, res, next) => {
//   try {
//     const newUser = await createUserService(req.body);
//     res.status(201).json(newUser);
//   } catch (error) {
//     next(error);
//   }
// };

export const createUser = (req, res) => {
  const userData = req.body;
  console.log("Received user data:", userData);

  res.json({ message: "User data received" });
};
