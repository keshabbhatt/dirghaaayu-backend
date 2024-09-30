import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to generate a token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

// Signup - anyone can register
export const signup = async (req, res) => {
    try {
        const { fullname, email, password, userImage } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        const createdUser = new User({
            fullname,
            email,
            password: hashPassword,
            userImage: userImage || '',
        });

        await createdUser.save();

        // Generate a token after signup
        const token = generateToken(createdUser);

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email,
                isAdmin: createdUser.isAdmin,
                userImage: createdUser.userImage,
            },
            token,
        });
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Login - existing users
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate a token after login
        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isAdmin: user.isAdmin,
                userImage: user.userImage,
            },
            token,
        });
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get all users - admin access
export const getUsers = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get user details by ID
export const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isAdmin: user.isAdmin,
                userImage: user.userImage,
            },
        });
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update user - admin access or user can update own profile
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { fullname, email, password, isAdmin, userImage } = req.body;

        // Check if the user is admin or updating their own profile
        if (req.user._id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields if provided
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (password) user.password = await bcryptjs.hash(password, 10);
        if (userImage) user.userImage = userImage;
        if (typeof isAdmin !== 'undefined' && req.user.isAdmin) user.isAdmin = isAdmin;

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isAdmin: user.isAdmin,
                userImage: user.userImage,
            },
        });
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete user - admin access only
export const deleteUser = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
