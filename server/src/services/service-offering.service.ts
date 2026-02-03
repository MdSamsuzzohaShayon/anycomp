import { AppDataSource } from "../data-source";
import { ServiceOffering } from "../entities/ServiceOffering";

export class ServiceOfferingService {
  private repo = AppDataSource.getRepository(ServiceOffering);

  create(data: Partial<ServiceOffering>) {
    const serviceOffering = this.repo.create(data);
    return this.repo.save(serviceOffering);
  }

  findAll() {
    return this.repo.find({
      relations: ["specialist"]
    });
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ["specialist"]
    });
  }

  findBySpecialist(specialistId: string) {
    return this.repo.find({
      where: { specialist: { id: specialistId } }
    });
  }

  update(id: string, data: Partial<ServiceOffering>) {
    return this.repo.update(id, data).then(() => this.findById(id));
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}