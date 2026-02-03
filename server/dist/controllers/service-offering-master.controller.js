"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServiceOfferingMaster = exports.updateServiceOfferingMaster = exports.getServiceOfferingMasters = exports.createServiceOfferingMaster = void 0;
const service_offering_master_service_1 = require("../services/service-offering-master.service");
const service = new service_offering_master_service_1.ServiceOfferingMasterService();
const createServiceOfferingMaster = async (req, res) => {
    // const master = await service.create(req.body);
    const master = await service.createWithRelations(req.body);
    res.status(201).json(master);
};
exports.createServiceOfferingMaster = createServiceOfferingMaster;
const getServiceOfferingMasters = async (req, res) => {
    const { id } = req.params;
    if (id) {
        const master = await service.findById(String(id));
        if (!master) {
            return res
                .status(404)
                .json({ message: "Service offering master not found" });
        }
        return res.json(master);
    }
    const masters = await service.findAll();
    res.json(masters);
};
exports.getServiceOfferingMasters = getServiceOfferingMasters;
const updateServiceOfferingMaster = async (req, res) => {
    const { id } = req.params;
    // const master = await service.update(String(id), req.body);
    const master = await service.updateWithRelations(String(id), req.body);
    if (!master) {
        return res
            .status(404)
            .json({ message: "Service offering master not found" });
    }
    res.json(master);
};
exports.updateServiceOfferingMaster = updateServiceOfferingMaster;
const deleteServiceOfferingMaster = async (req, res) => {
    const { id } = req.params;
    const result = await service.delete(String(id));
    if (!result.affected) {
        return res
            .status(404)
            .json({ message: "Service offering master not found" });
    }
    res.json({ message: "Service offering master deleted successfully" });
};
exports.deleteServiceOfferingMaster = deleteServiceOfferingMaster;
