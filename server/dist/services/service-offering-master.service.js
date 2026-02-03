"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOfferingMasterService = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
const ServiceOffering_1 = require("../entities/ServiceOffering");
const ServiceOfferingMasterList_1 = require("../entities/ServiceOfferingMasterList");
class ServiceOfferingMasterService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(ServiceOfferingMasterList_1.ServiceOfferingMasterList);
        this.serviceOfferingRepo = data_source_1.AppDataSource.getRepository(ServiceOffering_1.ServiceOffering);
    }
    create(data) {
        const master = this.repo.create(data);
        return this.repo.save(master);
    }
    async createWithRelations(data) {
        const { service_offerings, ...masterData } = data;
        // 1️⃣ Create master first
        const { s3_key, ...rest } = masterData;
        const master = this.repo.create({
            ...rest,
            ...(s3_key != null ? { s3_key } : {}),
        });
        await this.repo.save(master);
        // 2️⃣ Attach service offerings (owning side)
        if (service_offerings?.length) {
            const offerings = await this.serviceOfferingRepo.find({
                where: { id: (0, typeorm_1.In)(service_offerings) },
            });
            for (const offering of offerings) {
                offering.serviceOfferingMaster = master;
            }
            await this.serviceOfferingRepo.save(offerings);
        }
        // 3️⃣ Return with relations
        return this.repo.findOne({
            where: { id: master.id },
            relations: ["service_offerings"],
        });
    }
    findAll() {
        return this.repo.find({
            relations: ["service_offerings"],
        });
    }
    findById(id) {
        return this.repo.findOne({
            where: { id },
            relations: ["service_offerings"],
        });
    }
    update(id, data) {
        return this.repo.update(id, data).then(() => this.findById(id));
    }
    async updateWithRelations(id, data) {
        const { service_offerings, ...masterData } = data;
        // 1️⃣ Load existing master
        const master = await this.repo.findOne({
            where: { id },
            relations: ["service_offerings"],
        });
        if (!master) {
            throw new Error("Service offering master not found");
        }
        // 2️⃣ Update scalar fields safely
        Object.assign(master, {
            ...masterData,
            ...(data.s3_key !== undefined
                ? { s3_key: data.s3_key }
                : {}),
        });
        await this.repo.save(master);
        // 3️⃣ Update relations if provided
        if (service_offerings) {
            // 3a️⃣ Find current offerings linked to this master
            const currentOfferings = await this.serviceOfferingRepo.find({
                where: { serviceOfferingMaster: { id } },
            });
            const currentIds = currentOfferings.map(o => o.id);
            const newIds = service_offerings;
            // 3b️⃣ Detach removed offerings
            const toDetach = currentOfferings.filter(o => !newIds.includes(o.id));
            for (const offering of toDetach) {
                offering.serviceOfferingMaster = null;
            }
            // 3c️⃣ Attach new offerings
            const toAttachIds = newIds.filter(id => !currentIds.includes(id));
            if (toAttachIds.length) {
                const toAttach = await this.serviceOfferingRepo.find({
                    where: { id: (0, typeorm_1.In)(toAttachIds) },
                });
                for (const offering of toAttach) {
                    offering.serviceOfferingMaster = master;
                }
                await this.serviceOfferingRepo.save(toAttach);
            }
            if (toDetach.length) {
                await this.serviceOfferingRepo.save(toDetach);
            }
        }
        // 4️⃣ Return updated entity with relations
        return this.findById(id);
    }
    delete(id) {
        return this.repo.delete(id);
    }
}
exports.ServiceOfferingMasterService = ServiceOfferingMasterService;
