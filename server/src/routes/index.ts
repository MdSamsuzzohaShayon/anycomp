import { Router } from "express";
import specialistRoutes from "./specialist.routes";
import userRoutes from "./user.routes";
import mediaRoutes from "./media.routes";
import platformFeeRoutes from "./platform-fee.routes";
import serviceOfferingRoutes from "./service-offering.routes";
import serviceOfferingMasterRoutes from "./service-offering-master.routes";

const router = Router();

router.use("/specialists", specialistRoutes);
router.use("/users", userRoutes);
router.use("/media", mediaRoutes);
router.use("/platform-fee", platformFeeRoutes);
router.use("/service-offerings", serviceOfferingRoutes);
router.use("/service-offering-masters", serviceOfferingMasterRoutes);

export default router;
