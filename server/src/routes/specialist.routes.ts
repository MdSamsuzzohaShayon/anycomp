import { Router } from "express";
import { createSpecialist, getSpecialists } from "../controllers/specialist.controller";

const router = Router();

router.post("/", createSpecialist);
router.get("/", getSpecialists);

export default router;
