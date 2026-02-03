"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlatformFee = exports.updatePlatformFee = exports.calculatePlatformFee = exports.getPlatformFees = exports.createPlatformFee = void 0;
const platform_fee_service_1 = require("../services/platform-fee.service");
const service = new platform_fee_service_1.PlatformFeeService();
const createPlatformFee = async (req, res) => {
    const platformFee = await service.create(req.body);
    res.status(201).json(platformFee);
};
exports.createPlatformFee = createPlatformFee;
const getPlatformFees = async (req, res) => {
    const { id } = req.params;
    if (id) {
        const platformFee = await service.findById(String(id));
        if (!platformFee) {
            return res.status(404).json({ message: "Platform fee not found" });
        }
        return res.json(platformFee);
    }
    const platformFees = await service.findAll();
    res.json(platformFees);
};
exports.getPlatformFees = getPlatformFees;
const calculatePlatformFee = async (req, res) => {
    const { amount } = req.params;
    const fee = await service.calculateFee(parseFloat(String(amount)));
    if (!fee) {
        return res.status(400).json({ message: "Could not calculate platform fee for the given amount" });
    }
    res.json(fee);
};
exports.calculatePlatformFee = calculatePlatformFee;
const updatePlatformFee = async (req, res) => {
    const { id } = req.params;
    const platformFee = await service.update(String(id), req.body);
    if (!platformFee) {
        return res.status(404).json({ message: "Platform fee not found" });
    }
    res.json(platformFee);
};
exports.updatePlatformFee = updatePlatformFee;
const deletePlatformFee = async (req, res) => {
    const { id } = req.params;
    const result = await service.delete(String(id));
    if (!result) {
        return res.status(404).json({ message: "Platform fee not found" });
    }
    res.json({ message: "Platform fee deleted successfully" });
};
exports.deletePlatformFee = deletePlatformFee;
