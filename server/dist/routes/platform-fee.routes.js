"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const platform_fee_controller_1 = require("../controllers/platform-fee.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Only admin should manage platform fees
router.post("/", auth_1.authenticate, platform_fee_controller_1.createPlatformFee);
router.get("/", platform_fee_controller_1.getPlatformFees);
router.get("/:id", platform_fee_controller_1.getPlatformFees);
router.get("/calculate/:amount", auth_1.authenticate, platform_fee_controller_1.calculatePlatformFee);
router.put("/:id", auth_1.authenticate, platform_fee_controller_1.updatePlatformFee);
router.delete("/:id", auth_1.authenticate, platform_fee_controller_1.deletePlatformFee);
exports.default = router;
