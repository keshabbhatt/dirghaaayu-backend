// Importing required modules and functions
import express from "express"; // Importing Express framework for creating server and handling routes
import {
  UserLogin, // Importing UserLogin controller function
  UserRegister, // Importing UserRegister controller function
} from "../controllers/User.js"; // Importing from the User controller
import { verifyToken } from "../middleware/verifyToken.js"; // Importing middleware to verify JWT tokens

// Create a new router object
const router = express.Router(); // Creating an instance of an Express Router

// Define route for user registration
router.post("/signup", UserRegister); // POST request to /api/user/signup will invoke UserRegister controller

// Define route for user login
router.post("/signin", UserLogin); // POST request to /api/user/signin will invoke UserLogin controller
export default router; // Exporting the router to be used in other parts of the application
