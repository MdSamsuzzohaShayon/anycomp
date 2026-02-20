import { Request, Response } from "express";
import { SpecialistService } from "../services/specialist.service";
import formidable from "formidable";
import { Specialist } from "../entities/Specialist";

const service = new SpecialistService();

export const createSpecialist = async (req: Request, res: Response) => {
  try {
    // In here, we will accept properties in different tables

    // specialist table: title, description, duration_days, base_price, is_draft
    // medis table: images
    // service_offerings table: services

    /*
      🎯 Final Goal of /api/specialists

      From a single call, backend must:

      ✔ create/update specialist
      ✔ attach selected offerings
      ✔ upload images
      ✔ create media rows
      ✔ calculate fees
      ✔ return aggregated object
    */
    const form = formidable({ multiples: true });

    const [fields, files] = await form.parse(req);
    // Normalize image list
    // get images from the object
    const images = files.images;

    const imageFiles = images
      ? Array.isArray(images)
        ? images
        : [images]
      : [];

    const { title, description, duration_days, base_price, is_draft } = fields;
    const draft = is_draft && is_draft?.length > 0 && is_draft[0].toLowerCase() === "false" ? false : true;
    const specialistData = {
      title: String(title),
      description: String(description),
      duration_days: parseInt(String(duration_days), 10),
      base_price: parseFloat(String(base_price)),
      is_draft: draft
    }

    let services: string[] = [];

    if (fields.services) {
      try {
        services = JSON.parse(
          Array.isArray(fields.services)
            ? fields.services[0]
            : fields.services
        );
      } catch {
        services = [];
      }
    }


    const specialist = await service.create({
      specialistData,
      services,
      files: imageFiles
    });

    // const specialist = await service.create(req.body);
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
      error,
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

    const existingSpecialist = await service.findById(String(id));
    if (!existingSpecialist) {
      return res.status(404).json({ message: "Specialist not found" });
    }

    const form = formidable({ multiples: true });
    const [fields, files] = await form.parse(req);

    // Normalize images
    const images = files.images;
    const imageFiles = images
      ? Array.isArray(images)
        ? images
        : [images]
      : [];

    // Build partial specialistData (ONLY if field exists)
    const specialistData: Partial<Pick<
      Specialist,
      "title" | "description" | "duration_days" | "base_price" | "is_draft"
    >> = {};

    if (fields.title !== undefined) {
      specialistData.title = String(fields.title);
    }

    if (fields.description !== undefined) {
      specialistData.description = String(fields.description);
    }

    if (fields.duration_days !== undefined) {
      specialistData.duration_days = parseInt(
        String(fields.duration_days),
        10
      );
    }

    if (fields.base_price !== undefined) {
      specialistData.base_price = parseFloat(String(fields.base_price));
    }

    if (fields.is_draft !== undefined) {
      specialistData.is_draft =
        String(fields.is_draft) === "true";
    }

    // Parse services (optional)
    let services: string[] | undefined = undefined;

    if (fields.services !== undefined) {
      try {
        services = JSON.parse(
          Array.isArray(fields.services)
            ? fields.services[0]
            : fields.services
        );
      } catch {
        services = [];
      }
    }

    const updated = await service.updateFull({
      id: String(id),
      specialistData,
      services,
      files: imageFiles,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to update specialist",
      error,
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