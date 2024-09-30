import { Router } from "express";
import { signup, login, getUsers, getUserDetails, updateUser, deleteUser } from "../controller/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/", authenticateUser, getUsers); // Admin-protected
router.get("/:id", authenticateUser, getUserDetails); // User-protected
router.put("/:id", authenticateUser, updateUser); // User-protected, admin can edit any user
router.delete("/:id", authenticateUser, deleteUser); // Admin-protected

export default router;
