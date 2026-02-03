import { Request, Response } from "express";
import { ServiceOfferingService } from "../services/service-offering.service";

const service = new ServiceOfferingService();

export const createServiceOffering = async (req: Request, res: Response) => {
  const serviceOffering = await service.create(req.body);
  res.status(201).json(serviceOffering);
};

export const getServiceOfferings = async (req: Request, res: Response) => {
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

export const updateServiceOffering = async (req: Request, res: Response) => {
  const { id } = req.params;
  const serviceOffering = await service.update(String(id), req.body);
  if (!serviceOffering) {
    return res.status(404).json({ message: "Service offering not found" });
  }
  res.json(serviceOffering);
};

export const deleteServiceOffering = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await service.delete(String(id));
  if (!result) {
    return res.status(404).json({ message: "Service offering not found" });
  }
  res.json({ message: "Service offering deleted successfully" });
};