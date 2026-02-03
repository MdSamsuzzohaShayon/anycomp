"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistService = void 0;
const data_source_1 = require("../data-source");
const Specialist_1 = require("../entities/Specialist");
const typeorm_1 = require("typeorm");
class SpecialistService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(Specialist_1.Specialist);
    }
    async create(data) {
        // Validate required fields
        if (!data.slug) {
            throw new Error("Specialist name is required");
        }
        const specialist = this.repo.create(data);
        return this.repo.save(specialist);
    }
    async findAll(search) {
        const where = {};
        if (search) {
            where.title = (0, typeorm_1.Like)(`%${search}%`);
        }
        return this.repo.find({
            where,
            relations: ["media", "service_offerings"],
            order: { created_at: "DESC" }
        });
    }
    async findById(id) {
        if (!id) {
            throw new Error("Specialist ID is required");
        }
        return this.repo.findOne({
            where: { id },
            relations: ["media", "service_offerings"],
        });
    }
    async update(id, data) {
        if (!id) {
            throw new Error("Specialist ID is required");
        }
        // Check if specialist exists
        const specialist = await this.repo.findOne({ where: { id } });
        if (!specialist) {
            throw new Error("Specialist not found");
        }
        // Merge data
        Object.assign(specialist, data);
        // Set updated timestamp
        specialist.updated_at = new Date();
        return this.repo.save(specialist);
    }
    async delete(id) {
        if (!id) {
            throw new Error("Specialist ID is required");
        }
        // Check if specialist exists
        const specialist = await this.repo.findOne({ where: { id } });
        if (!specialist) {
            throw new Error("Specialist not found");
        }
        return this.repo.remove(specialist);
    }
    // Optional: Search specialists by name or email
    async search(query) {
        return this.repo.find({
            where: [
                { title: (0, typeorm_1.Like)(`%${query}%`) },
                { slug: (0, typeorm_1.Like)(`%${query}%`) }
            ],
            relations: ["media", "service_offerings"],
            take: 20 // Limit results
        });
    }
    // Optional: Get specialists with pagination
    async findWithPagination(skip = 0, take = 10) {
        const [data, total] = await this.repo.findAndCount({
            relations: ["media", "service_offerings"],
            order: { created_at: "DESC" },
            skip,
            take
        });
        return {
            data,
            total,
            page: Math.floor(skip / take) + 1,
            totalPages: Math.ceil(total / take)
        };
    }
}
exports.SpecialistService = SpecialistService;
