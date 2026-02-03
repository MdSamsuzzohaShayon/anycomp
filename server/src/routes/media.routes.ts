import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createMedia, deleteMedia, getMedia, updateMedia } from "../controllers/media.controller";

const router = Router();

router.post("/", authenticate, createMedia);
router.get("/", getMedia);
router.get("/:id", getMedia);
router.put("/:id", authenticate, updateMedia);
router.delete("/:id", authenticate, deleteMedia);

export default router;