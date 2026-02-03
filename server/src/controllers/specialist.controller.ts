import { Request, Response } from "express";
import { SpecialistService } from "../services/specialist.service";

const service = new SpecialistService();

export const createSpecialist = async (req: Request, res: Response) => {
  try {
    const specialist = await service.create(req.body);
    res.status(201).json(specialist);
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message || "Failed to create specialist",
      error: error 
    });
  }
};

export const getSpecialists = async (_: Request, res: Response) => {
  try {
    const specialists = await service.findAll();
    res.json(specialists);
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || "Failed to fetch specialists",
      error: error 
    });
  }
};

export const getSpecialistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Specialist ID is required" });
    }

    const specialist = await service.findById(String(id));
    
    if (!specialist) {
      return res.status(404).json({ message: "Specialist not found" });
    }
    
    res.json(specialist);
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || "Failed to fetch specialist",
      error: error 
    });
  }
};

export const updateSpecialist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Specialist ID is required" });
    }

    // Check if specialist exists
    const existingSpecialist = await service.findById(String(id));
    if (!existingSpecialist) {
      return res.status(404).json({ message: "Specialist not found" });
    }

    const updatedSpecialist = await service.update(String(id), req.body);
    res.json(updatedSpecialist);
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message || "Failed to update specialist",
      error: error 
    });
  }
};

export const deleteSpecialist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Specialist ID is required" });
    }

    // Check if specialist exists
    const existingSpecialist = await service.findById(String(id));
    if (!existingSpecialist) {
      return res.status(404).json({ message: "Specialist not found" });
    }

    await service.delete(String(id));
    res.status(204).send(); // No content
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || "Failed to delete specialist",
      error: error 
    });
  }
};