import bcrypt from "bcrypt"; // Import the bcrypt library for hashing passwords
import jwt from "jsonwebtoken"; // Import the jsonwebtoken library for creating JWT tokens
import dotenv from "dotenv"; // Import dotenv to load environment variables
import { createError } from "../error.js"; // Import a custom error handling function
import User from "../models/User.js"; // Import the User model

dotenv.config(); // Load environment variables from the .env file

// User registration handler
export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body; // Destructure user details from request body

    // Check if the email is already in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use.")); // Email conflict error
    }

    const salt = bcrypt.genSaltSync(10); // Generate a salt for hashing the password
    const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password

    const user = new User({ // Create a new User instance
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save(); // Save the user to the database

    // Generate a JWT token for the user
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years", // Set an expiration time for the token
    });
    return res.status(200).json({ token, user }); // Return the token and user details
  } catch (error) {
    return next(error); // Pass any errors to the error handler
  }
};

// User login handler
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Destructure email and password from request body

    const user = await User.findOne({ email: email }); // Find the user by email
    if (!user) {
      return next(createError(404, "User not found")); // User not found error
    }
    console.log(user);

    const isPasswordCorrect = await bcrypt.compareSync(password, user.password); // Compare passwords
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password")); // Incorrect password error
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years", // Set an expiration time for the token
    });

    return res.status(200).json({ token, user }); // Return the token and user details
  } catch (error) {
    return next(error); // Pass any errors to the error handler
  }
};
