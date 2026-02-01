import { Request, Response } from "express";
import { SpecialistService } from "../services/specialist.service";

const service = new SpecialistService();

export const createSpecialist = async (req: Request, res: Response) => {
  const specialist = await service.create(req.body);
  res.status(201).json(specialist);
};

export const getSpecialists = async (_: Request, res: Response) => {
  const specialists = await service.findAll();
  res.json(specialists);
};
