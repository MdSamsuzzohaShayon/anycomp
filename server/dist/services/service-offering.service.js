"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOfferingService = void 0;
const data_source_1 = require("../data-source");
const ServiceOffering_1 = require("../entities/ServiceOffering");
class ServiceOfferingService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(ServiceOffering_1.ServiceOffering);
    }
    create(data) {
        const serviceOffering = this.repo.create(data);
        return this.repo.save(serviceOffering);
    }
    findAll() {
        return this.repo.find({
            relations: ["specialist"]
        });
    }
    findById(id) {
        return this.repo.findOne({
            where: { id },
            relations: ["specialist"]
        });
    }
    findBySpecialist(specialistId) {
        return this.repo.find({
            where: { specialist: { id: specialistId } }
        });
    }
    update(id, data) {
        return this.repo.update(id, data).then(() => this.findById(id));
    }
    delete(id) {
        return this.repo.delete(id);
    }
}
exports.ServiceOfferingService = ServiceOfferingService;
