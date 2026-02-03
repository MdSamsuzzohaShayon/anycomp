import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createServiceOfferingMaster, deleteServiceOfferingMaster, getServiceOfferingMasters, updateServiceOfferingMaster } from "../controllers/service-offering-master.controller";

const router = Router();

router.post("/", authenticate, createServiceOfferingMaster);
router.get("/", getServiceOfferingMasters);
router.get("/:id", getServiceOfferingMasters);
router.put("/:id", authenticate, updateServiceOfferingMaster);
router.delete("/:id", authenticate, deleteServiceOfferingMaster);

export default router;
