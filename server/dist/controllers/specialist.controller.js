"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpecialist = exports.updateSpecialist = exports.getSpecialistById = exports.getSpecialists = exports.createSpecialist = void 0;
const specialist_service_1 = require("../services/specialist.service");
const service = new specialist_service_1.SpecialistService();
const createSpecialist = async (req, res) => {
    try {
        const specialist = await service.create(req.body);
        res.status(201).json(specialist);
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to create specialist",
            error: error
        });
    }
};
exports.createSpecialist = createSpecialist;
const getSpecialists = async (_, res) => {
    try {
        const specialists = await service.findAll();
        res.json(specialists);
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Failed to fetch specialists",
            error: error
        });
    }
};
exports.getSpecialists = getSpecialists;
const getSpecialistById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Specialist ID is required" });
        }
        const specialist = await service.findById(String(id));
        if (!specialist) {
            return res.status(404).json({ message: "Specialist not found" });
        }
        res.json(specialist);
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Failed to fetch specialist",
            error: error
        });
    }
};
exports.getSpecialistById = getSpecialistById;
const updateSpecialist = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Specialist ID is required" });
        }
        // Check if specialist exists
        const existingSpecialist = await service.findById(String(id));
        if (!existingSpecialist) {
            return res.status(404).json({ message: "Specialist not found" });
        }
        const updatedSpecialist = await service.update(String(id), req.body);
        res.json(updatedSpecialist);
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to update specialist",
            error: error
        });
    }
};
exports.updateSpecialist = updateSpecialist;
const deleteSpecialist = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Specialist ID is required" });
        }
        // Check if specialist exists
        const existingSpecialist = await service.findById(String(id));
        if (!existingSpecialist) {
            return res.status(404).json({ message: "Specialist not found" });
        }
        await service.delete(String(id));
        res.status(204).send(); // No content
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Failed to delete specialist",
            error: error
        });
    }
};
exports.deleteSpecialist = deleteSpecialist;
