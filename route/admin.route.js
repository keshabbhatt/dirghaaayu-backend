import express from "express";
import { getUsers, deleteUser } from "../controller/user.controller.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Route to get all users (admin only)
router.get("/users", isAdmin, getUsers);

// Route to delete a user (admin only)
router.delete("/users/:id", isAdmin, deleteUser);


export default router;
