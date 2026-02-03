"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.updateMedia = exports.getMedia = exports.createMedia = void 0;
const media_service_1 = require("../services/media.service");
const service = new media_service_1.MediaService();
const createMedia = async (req, res) => {
    const media = await service.create(req.body);
    res.status(201).json(media);
};
exports.createMedia = createMedia;
const getMedia = async (req, res) => {
    const { id } = req.params;
    if (id) {
        const media = await service.findById(String(id));
        if (!media) {
            return res.status(404).json({ message: "Media not found" });
        }
        return res.json(media);
    }
    const media = await service.findAll();
    res.json(media);
};
exports.getMedia = getMedia;
const updateMedia = async (req, res) => {
    const { id } = req.params;
    const media = await service.update(String(id), req.body);
    if (!media) {
        return res.status(404).json({ message: "Media not found" });
    }
    res.json(media);
};
exports.updateMedia = updateMedia;
const deleteMedia = async (req, res) => {
    const { id } = req.params;
    const result = await service.delete(String(id));
    if (!result) {
        return res.status(404).json({ message: "Media not found" });
    }
    res.json({ message: "Media deleted successfully" });
};
exports.deleteMedia = deleteMedia;
