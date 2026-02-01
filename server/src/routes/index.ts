import { Router } from "express";
import specialistRoutes from "./specialist.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/specialists", specialistRoutes);
router.use("/users", userRoutes);

export default router;
