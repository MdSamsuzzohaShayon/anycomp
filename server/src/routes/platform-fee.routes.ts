import { Router } from "express";
import { createPlatformFee, getPlatformFees, updatePlatformFee, deletePlatformFee, calculatePlatformFee } from "../controllers/platform-fee.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Only admin should manage platform fees
router.post("/", authenticate, createPlatformFee);
router.get("/", getPlatformFees);
router.get("/:id", getPlatformFees);
router.get("/calculate/:amount", authenticate, calculatePlatformFee);
router.put("/:id", authenticate, updatePlatformFee);
router.delete("/:id", authenticate, deletePlatformFee);

export default router;