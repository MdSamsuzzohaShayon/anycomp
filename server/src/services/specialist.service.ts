import { AppDataSource } from "../data-source";
import { Specialist } from "../entities/Specialist";
import { Like, FindOptionsWhere } from "typeorm";

export class SpecialistService {
  private repo = AppDataSource.getRepository(Specialist);

  async create(data: Partial<Specialist>) {
    // Validate required fields
    if (!data.slug) {
      throw new Error("Specialist name is required");
    }

    const specialist = this.repo.create(data);
    return this.repo.save(specialist);
  }

  async findAll(search?: string) {
    const where: FindOptionsWhere<Specialist> = {};
    
    if (search) {
      where.title = Like(`%${search}%`);
    }

    return this.repo.find({
      where,
      relations: ["media", "service_offerings"],
      order: { created_at: "DESC" }
    });
  }

  async findById(id: string) {
    if (!id) {
      throw new Error("Specialist ID is required");
    }

    return this.repo.findOne({
      where: { id },
      relations: ["media", "service_offerings"],
    });
  }

  async update(id: string, data: Partial<Specialist>) {
    if (!id) {
      throw new Error("Specialist ID is required");
    }

    // Check if specialist exists
    const specialist = await this.repo.findOne({ where: { id } });
    if (!specialist) {
      throw new Error("Specialist not found");
    }

    // Merge data
    Object.assign(specialist, data);
    
    // Set updated timestamp
    specialist.updated_at = new Date();
    
    return this.repo.save(specialist);
  }

  async delete(id: string) {
    if (!id) {
      throw new Error("Specialist ID is required");
    }

    // Check if specialist exists
    const specialist = await this.repo.findOne({ where: { id } });
    if (!specialist) {
      throw new Error("Specialist not found");
    }

    return this.repo.remove(specialist);
  }

  // Optional: Search specialists by name or email
  async search(query: string) {
    return this.repo.find({
      where: [
        { title: Like(`%${query}%`) },
        { slug: Like(`%${query}%`) }
      ],
      relations: ["media", "service_offerings"],
      take: 20 // Limit results
    });
  }

  // Optional: Get specialists with pagination
  async findWithPagination(skip: number = 0, take: number = 10) {
    const [data, total] = await this.repo.findAndCount({
      relations: ["media", "service_offerings"],
      order: { created_at: "DESC" },
      skip,
      take
    });

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take)
    };
  }
}