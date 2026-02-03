import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createServiceOffering, getServiceOfferings, updateServiceOffering, deleteServiceOffering } from "../controllers/service-offering.controller";

const router = Router();

router.post("/", authenticate, createServiceOffering);
router.get("/", getServiceOfferings);
router.get("/:id", getServiceOfferings);
router.put("/:id", authenticate, updateServiceOffering);
router.delete("/:id", authenticate, deleteServiceOffering);

export default router;