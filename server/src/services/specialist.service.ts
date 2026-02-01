import { AppDataSource } from "../data-source";
import { Specialist } from "../entities/Specialist";

export class SpecialistService {
  private repo = AppDataSource.getRepository(Specialist);

  create(data: Partial<Specialist>) {
    const specialist = this.repo.create(data);
    return this.repo.save(specialist);
  }

  findAll() {
    return this.repo.find({
      relations: ["media", "service_offerings"],
    });
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ["media", "service_offerings"],
    });
  }
}
