// Importing necessary modules
import express from "express"; // Import Express to create and manage the server
import dotenv from "dotenv"; // Import dotenv to load environment variables from a .env file
import cors from "cors"; // Import CORS middleware to handle Cross-Origin Resource Sharing
import connectDB from "./lib/db.js"; // Import the function to connect to the database

// Importing routes
import adminRoute from "./route/admin.route.js"; // Admin-related API endpoints
import userRoute from "./route/user.route.js"; // Another set of user-related API endpoints

// Load environment variables from .env file into process.env
dotenv.config();

// Initialize an Express application
const app = express();

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors()); // This allows your API to be accessed from different origins (useful for front-end and back-end separation)

// Middleware to parse incoming JSON requests
app.use(express.json({ limit: '50mb' })); // Set a limit for JSON request bodies (default is 1mb)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data from forms or query strings

// Define API routes
app.use("/api/user", userRoute); // Route for user-related API requests


app.use("/admin", adminRoute); // Route for admin-related API requests
app.use("/user", userRoute); // Another route for user-related API requests


// Define a basic route for the root URL
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello developers from Dirghayuu", // Simple message for the root URL
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const status = err.status || 500; // Default to 500 if status is not provided
    const message = err.message || "Something went wrong"; // Default error message
    res.status(status).json({
        success: false, // Indicate that the request was not successful
        status, // Send the HTTP status code
        message, // Send the error message
    });
});

// Function to start the server and connect to the database
const startServer = async () => {
    try {
        await connectDB(); // Connect to the database
        const PORT = process.env.PORT || 8080; // Use PORT from environment variables or default to 8080
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
        }); // Start the server on the specified PORT
    } catch (error) {
        console.error("Error starting server", error); // Log any errors that occur during server startup
    }
};

// Call the function to start the server
startServer();
