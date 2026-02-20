import { Router } from "express";
import { 
  createSpecialist, 
  getSpecialists,
  getSpecialistById,
  updateSpecialist,
  deleteSpecialist 
} from "../controllers/specialist.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// authenticate
router.post("/", authenticate, createSpecialist);
router.get("/", getSpecialists);
router.get("/:id", getSpecialistById);
router.put("/:id", authenticate, updateSpecialist);
router.patch("/:id", authenticate, updateSpecialist);
router.delete("/:id", authenticate, deleteSpecialist);

export default router;