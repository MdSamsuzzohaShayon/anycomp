"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const data_source_1 = require("../data-source");
const Media_1 = require("../entities/Media");
class MediaService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(Media_1.Media);
    }
    create(data) {
        const media = this.repo.create(data);
        return this.repo.save(media);
    }
    findAll() {
        return this.repo.find({
            relations: ["specialist"],
            order: { display_order: "ASC" }
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
            where: { specialist: { id: specialistId } },
            order: { display_order: "ASC" }
        });
    }
    update(id, data) {
        return this.repo.update(id, data).then(() => this.findById(id));
    }
    delete(id) {
        return this.repo.softDelete(id);
    }
}
exports.MediaService = MediaService;
