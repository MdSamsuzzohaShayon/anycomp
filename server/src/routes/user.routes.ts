// src/routes/user.routes.ts
import { Router } from "express";
import { registerUser, loginUser, forgotPassword, changePassword } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", authenticate, changePassword);

export default router;
