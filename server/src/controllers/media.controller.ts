import { Request, Response } from "express";
import { MediaService } from "../services/media.service";

const service = new MediaService();

export const createMedia = async (req: Request, res: Response) => {
  const media = await service.create(req.body);
  res.status(201).json(media);
};

export const getMedia = async (req: Request, res: Response) => {
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

export const updateMedia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const media = await service.update(String(id), req.body);
  if (!media) {
    return res.status(404).json({ message: "Media not found" });
  }
  res.json(media);
};

export const deleteMedia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await service.delete(String(id));
  if (!result) {
    return res.status(404).json({ message: "Media not found" });
  }
  res.json({ message: "Media deleted successfully" });
};