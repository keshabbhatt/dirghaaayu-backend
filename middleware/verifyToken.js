import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  try {
    // Check if the authorization header is present
    if (!req.headers.authorization) {
      return next(createError(401, "You are not authenticated!"));
    }

    // Split the authorization header to get the token
    const token = req.headers.authorization.split(" ")[1];

    // Check if the token is present
    if (!token) return next(createError(401, "You are not authenticated"));

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT);

    // Assign the decoded user information to the request object
    req.user = decoded;
    
    // Call the next middleware or route handler
    next();
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Token verification error:", err);

    // Handle different types of token errors
    if (err.name === 'TokenExpiredError') {
      return next(createError(401, "Token has expired"));
    } else if (err.name === 'JsonWebTokenError') {
      return next(createError(401, "Invalid token"));
    } else {
      return next(createError(500, "Internal Server Error"));
    }
  }
};
