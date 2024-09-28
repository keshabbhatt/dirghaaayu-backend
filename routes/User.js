import express from "express";
import {
  UserRegister,
  UserLogin,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controllers/User.js"; // Adjust the path as necessary

const router = express.Router();

// User registration
router.post("/signup", UserRegister);

// User login
router.post("/signin", UserLogin);

// Get all users
router.get("/", getAllUsers);

// Get user by ID
router.get("/:id", getUserById);

// Update user by ID
router.put("/update/:id", updateUser);

// Delete user by ID
router.delete("/delete/:id", deleteUser);

export default router;
