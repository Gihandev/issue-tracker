import express from "express";
import { login, register, updateMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected: update current user's name/email
router.put("/me", protect, updateMe);

export default router;