import { AppDataSource } from "../data-source";
import { Media } from "../entities/Media";

export class MediaService {
  private repo = AppDataSource.getRepository(Media);

  create(data: Partial<Media>) {
    const media = this.repo.create(data);
    return this.repo.save(media);
  }

  findAll() {
    return this.repo.find({
      relations: ["specialist"],
      order: { display_order: "ASC" }
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
      where: { specialist: { id: specialistId } },
      order: { display_order: "ASC" }
    });
  }

  update(id: string, data: Partial<Media>) {
    return this.repo.update(id, data).then(() => this.findById(id));
  }

  delete(id: string) {
    return this.repo.softDelete(id);
  }
}