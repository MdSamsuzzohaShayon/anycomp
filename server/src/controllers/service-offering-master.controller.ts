import { Request, Response } from "express";
import { ServiceOfferingMasterService } from "../services/service-offering-master.service";

const service = new ServiceOfferingMasterService();

export const createServiceOfferingMaster = async (
  req: Request,
  res: Response
) => {
  // const master = await service.create(req.body);
  const master = await service.createWithRelations(req.body);
  res.status(201).json(master);
};

export const getServiceOfferingMasters = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  if (id) {
    const master = await service.findById(String(id));
    if (!master) {
      return res
        .status(404)
        .json({ message: "Service offering master not found" });
    }
    return res.json(master);
  }

  const masters = await service.findAll();
  res.json(masters);
};

export const updateServiceOfferingMaster = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  // const master = await service.update(String(id), req.body);
  const master = await service.updateWithRelations(String(id), req.body);
  if (!master) {
    return res
      .status(404)
      .json({ message: "Service offering master not found" });
  }

  res.json(master);
};

export const deleteServiceOfferingMaster = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const result = await service.delete(String(id));
  if (!result.affected) {
    return res
      .status(404)
      .json({ message: "Service offering master not found" });
  }

  res.json({ message: "Service offering master deleted successfully" });
};
