import { Request, Response } from "express";
import { PlatformFeeService } from "../services/platform-fee.service";

const service = new PlatformFeeService();

export const createPlatformFee = async (req: Request, res: Response) => {
  const platformFee = await service.create(req.body);
  res.status(201).json(platformFee);
};

export const getPlatformFees = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (id) {
    const platformFee = await service.findById(String(id));
    if (!platformFee) {
      return res.status(404).json({ message: "Platform fee not found" });
    }
    return res.json(platformFee);
  }
  
  const platformFees = await service.findAll();
  res.json(platformFees);
};

export const calculatePlatformFee = async (req: Request, res: Response) => {
  const { amount } = req.params;
  const fee = await service.calculateFee(parseFloat(String(amount)));
  if (!fee) {
    return res.status(400).json({ message: "Could not calculate platform fee for the given amount" });
  }
  res.json(fee);
};

export const updatePlatformFee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const platformFee = await service.update(String(id), req.body);
  if (!platformFee) {
    return res.status(404).json({ message: "Platform fee not found" });
  }
  res.json(platformFee);
};

export const deletePlatformFee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await service.delete(String(id));
  if (!result) {
    return res.status(404).json({ message: "Platform fee not found" });
  }
  res.json({ message: "Platform fee deleted successfully" });
};