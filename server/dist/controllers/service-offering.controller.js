"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServiceOffering = exports.updateServiceOffering = exports.getServiceOfferings = exports.createServiceOffering = void 0;
const service_offering_service_1 = require("../services/service-offering.service");
const service = new service_offering_service_1.ServiceOfferingService();
const createServiceOffering = async (req, res) => {
    const serviceOffering = await service.create(req.body);
    res.status(201).json(serviceOffering);
};
exports.createServiceOffering = createServiceOffering;
const getServiceOfferings = async (req, res) => {
    const { id } = req.params;
    if (id) {
        const serviceOffering = await service.findById(String(id));
        if (!serviceOffering) {
            return res.status(404).json({ message: "Service offering not found" });
        }
        return res.json(serviceOffering);
    }
    const serviceOfferings = await service.findAll();
    res.json(serviceOfferings);
};
exports.getServiceOfferings = getServiceOfferings;
const updateServiceOffering = async (req, res) => {
    const { id } = req.params;
    const serviceOffering = await service.update(String(id), req.body);
    if (!serviceOffering) {
        return res.status(404).json({ message: "Service offering not found" });
    }
    res.json(serviceOffering);
};
exports.updateServiceOffering = updateServiceOffering;
const deleteServiceOffering = async (req, res) => {
    const { id } = req.params;
    const result = await service.delete(String(id));
    if (!result) {
        return res.status(404).json({ message: "Service offering not found" });
    }
    res.json({ message: "Service offering deleted successfully" });
};
exports.deleteServiceOffering = deleteServiceOffering;
