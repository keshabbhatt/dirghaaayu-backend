import jwt from "jsonwebtoken"; // Import the jsonwebtoken library for token verification
import { createError } from "../error.js"; // Import a custom error handling function

// Middleware function to verify JWT tokens
export const verifyToken = async (req, res, next) => {
  try {
    // Check if the authorization header is present
    if (!req.headers.authorization) {
      // If the authorization header is missing, create and pass an error to the next middleware
      return next(createError(401, "You are not authenticated!"));
    }

    // Split the authorization header to get the token
    // The format of the authorization header is usually "Bearer <token>"
    const token = req.headers.authorization.split(" ")[1];

    // Check if the token is present
    if (!token) {
      // If the token is missing, create and pass an error to the next middleware
      return next(createError(401, "You are not authenticated"));
    }

    // Verify the token using the secret key stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT);

    // Assign the decoded user information (payload) to the request object
    // This allows access to the user's information in subsequent middleware or route handlers
    req.user = decoded;
    
    // Call the next middleware or route handler
    next();
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Token verification error:", err);

    // Handle different types of token errors
    if (err.name === 'TokenExpiredError') {
      // If the token has expired, create and pass an error to the next middleware
      return next(createError(401, "Token has expired"));
    } else if (err.name === 'JsonWebTokenError') {
      // If the token is invalid, create and pass an error to the next middleware
      return next(createError(401, "Invalid token"));
    } else {
      // For other errors, create and pass a generic error to the next middleware
      return next(createError(500, "Internal Server Error"));
    }
  }
};
