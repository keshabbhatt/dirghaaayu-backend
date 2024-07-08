// Importing required modules
import express from "express"; // Importing Express framework for creating server and handling routes
import dotenv from "dotenv"; // Importing dotenv to load environment variables from a .env file
import cors from "cors"; // Importing CORS to handle Cross-Origin Resource Sharing
import mongoose from "mongoose"; // Importing Mongoose for MongoDB object modeling
import UserRoutes from "./routes/User.js"; // Importing user routes from a separate file
import SymptomRoutes from "./routes/Symptom.js"; // Importing symptom routes from a separate file

dotenv.config(); // Load environment variables from .env file into process.env

const app = express(); // Create an instance of Express application

app.use(cors()); // Enable CORS for all requests
app.use(express.json({ limit: "50mb" })); // Middleware to parse incoming JSON requests, setting limit to 50mb
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data (form data), extended: true allows for rich objects and arrays

// Use user routes for all requests starting with /api/user/
app.use("/api/user/", UserRoutes);

// Use symptom routes for all requests starting with /api/symptoms/
app.use("/api/symptoms/", SymptomRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500; // Set status to error status or default to 500
  const message = err.message || "Something went wrong"; // Set message to error message or default to "Something went wrong"
  return res.status(status).json({ // Send JSON response with error details
    success: false,
    status,
    message,
  });
});

// Route to handle root URL GET requests
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers from Dirghayuu",
  });
});

// Function to connect to MongoDB
const connectDB = () => {
  mongoose.set("strictQuery", true); // Set Mongoose to use strict query mode
  mongoose
    .connect(process.env.MONGODB_URL) // Connect to MongoDB using URL from environment variable
    .then(() => console.log("Connected to Mongo DB Atlas Changed !!")) // Log success message if connection is successful
    .catch((err) => {
      console.error("Failed to connect with Mongo"); // Log failure message if connection fails
      console.error(err); // Log the error details
    });
};

// Function to start the server
const startServer = async () => {
  try {
    connectDB(); // Connect to the database
    app.listen(8080, () => console.log("Server started on port 8080")); // Start the server on port 8080 and log message
  } catch (error) {
    console.log(error); // Log any errors that occur during server start
  }
};

// Start the server
startServer();
