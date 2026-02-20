import { AppDataSource } from "../data-source";
import { ServiceOffering } from "../entities/ServiceOffering";
import { Specialist } from "../entities/Specialist";
import { Like, FindOptionsWhere } from "typeorm";
import { uploadFile } from "../utils/r2";
import { Media } from "../entities/Media";
import crypto from 'crypto';
import formidable from "formidable";
import { slugify } from "../utils/helpers";
import { PlatformFee } from "../entities/PlatformFee";

export class SpecialistService {
  private repo = AppDataSource.getRepository(Specialist);

  async create({
    specialistData,
    services,
    files,
  }: {
    specialistData: Pick<
      Specialist,
      "title" | "description" | "duration_days" | "base_price" | "is_draft"
    >;
    services: string[];
    files: formidable.File[];
  }) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /**
       * Formula
       * platform_fee = base_price * percentage / 100
       * final_price = base_price + platform_fee
       */

      let platformFeeAmount = 0;
      let roundedFee = 0;
      let finalPrice = specialistData.base_price;
      // Fetch Platform Fee Tier
      if (!specialistData.is_draft) {
        if (specialistData.base_price <= 0) {
          throw new Error("Base price must be greater than 0");
        }

        // calculate tier
        const platformFeeRepo = queryRunner.manager.getRepository(PlatformFee);

        const tier = await platformFeeRepo
          .createQueryBuilder("pf")
          .where(":price >= pf.min_value", {
            price: specialistData.base_price,
          })
          .andWhere("(pf.max_value IS NULL OR :price <= pf.max_value)", {
            price: specialistData.base_price,
          })
          .getOne();

        if (!tier) {
          throw new Error("No platform fee tier configured for this price");
        }

        platformFeeAmount =
          (specialistData.base_price * tier.platform_fee_percentage) / 100;

        roundedFee = Number(platformFeeAmount.toFixed(2));

        finalPrice = Number(
          (specialistData.base_price + roundedFee).toFixed(2)
        );
      }



      // 1️⃣ Create specialist
      const specialist = queryRunner.manager.create(Specialist, {
        ...specialistData,
        slug: slugify(specialistData.title),
        media: [],
        service_offerings: [],
        average_rating: 0,
        total_number_of_ratings: 0,
        platform_fee: roundedFee,
        final_price: finalPrice,
        is_verified: false,

      });

      await queryRunner.manager.save(specialist);

      // 2️⃣ Attach service offerings
      for (const masterId of services || []) {
        // Specify service master id
        const offering = queryRunner.manager.create(ServiceOffering, {
          specialist: { id: specialist.id },
          serviceOfferingMaster: { id: masterId },
        });

        await queryRunner.manager.save(offering);
      }

      // 3️⃣ Upload images & create media rows
      let order = 0;

      for (const file of files || []) {
        const key = await uploadFile(file);
        

        const media = queryRunner.manager.create(Media, {
          // specialist: { id: specialist.id },
          specialist: specialist,
          file_name: key, //file.originalFilename || "unknown",
          file_size: file.size,
          mime_type: file.mimetype || "application/octet-stream",
          display_order: order++,
          media_type: "image", // or dynamically determine
        });

        await queryRunner.manager.save(media);
      }

      // 4️⃣ commit
      await queryRunner.commitTransaction();

      // 5️⃣ return aggregated data
      return this.repo.findOne({
        where: { id: specialist.id },
        relations: [
          "media",
          "service_offerings",
          "service_offerings.serviceOfferingMaster",
        ],
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }


  async findAll() {
    return this.repo
      .createQueryBuilder("specialist")
      .leftJoinAndSelect("specialist.media", "media")
      .leftJoinAndSelect("specialist.service_offerings", "service_offerings")
      .leftJoinAndSelect(
        "service_offerings.serviceOfferingMaster",
        "serviceOfferingMaster"
      )
      .where("specialist.is_draft = :isDraft", { isDraft: false })
      .orderBy("specialist.created_at", "DESC")
      .getMany();
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

  async updateFull({
    id,
    specialistData,
    services,
    files,
  }: {
    id: string;
    specialistData: Partial<
      Pick<
        Specialist,
        "title" | "description" | "duration_days" | "base_price" | "is_draft"
      >
    >;
    services?: string[];
    files: formidable.File[];
  }) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const specialist = await queryRunner.manager.findOne(Specialist, {
        where: { id },
        relations: ["service_offerings"],
      });

      if (!specialist) {
        throw new Error("Specialist not found");
      }

      // Track original values for fee recalculation logic
      const originalBasePrice = specialist.base_price;
      const originalDraftStatus = specialist.is_draft;

      // Merge only provided fields
      Object.assign(specialist, specialistData);

      if (specialistData.title) {
        specialist.slug = slugify(specialistData.title);
      }

      /**
       * 🔥 Fee Recalculation Logic
       *
       * Recalculate IF:
       * - base_price changed
       * - OR draft -> published
       */
      const basePriceChanged =
        specialistData.base_price !== undefined &&
        specialistData.base_price !== originalBasePrice;

      const publishingNow =
        originalDraftStatus === true &&
        specialistData.is_draft === false;

      if (!specialist.is_draft && (basePriceChanged || publishingNow)) {
        if (!specialist.base_price || specialist.base_price <= 0) {
          throw new Error("Base price must be greater than 0");
        }

        const platformFeeRepo = queryRunner.manager.getRepository(PlatformFee);

        const tier = await platformFeeRepo
          .createQueryBuilder("pf")
          .where(":price >= pf.min_value", { price: specialist.base_price })
          .andWhere("(pf.max_value IS NULL OR :price <= pf.max_value)", { price: specialist.base_price })
          .getOne();

        if (!tier) {
          throw new Error("No platform fee tier configured");
        }

        const fee = (specialist.base_price * tier.platform_fee_percentage) / 100;

        specialist.platform_fee = Number(fee.toFixed(2));

        const basePriceNum = Number(specialist.base_price);
        const platformFeeNum = Number(specialist.platform_fee);

        specialist.final_price = Number((basePriceNum + platformFeeNum).toFixed(2));
      }


      await queryRunner.manager.save(specialist);

      /**
       * 🔥 Update Services (ONLY if provided)
       */
      if (services !== undefined) {
        // remove old
        await queryRunner.manager.delete(ServiceOffering, {
          specialist: { id },
        });

        for (const masterId of services) {
          const offering = queryRunner.manager.create(ServiceOffering, {
            specialist: { id },
            serviceOfferingMaster: { id: masterId },
          });

          await queryRunner.manager.save(offering);
        }
      }

      /**
       * 🔥 Append New Images (optional)
       */
      if (files && files.length > 0) {
        let order = 0;

        for (const file of files) {
          await uploadFile(file);

          const media = queryRunner.manager.create(Media, {
            specialist: { id },
            file_name: file.originalFilename || "unknown",
            file_size: file.size,
            mime_type: file.mimetype || "application/octet-stream",
            display_order: order++,
            media_type: "image",
          });

          await queryRunner.manager.save(media);
        }
      }

      await queryRunner.commitTransaction();

      return this.repo.findOne({
        where: { id },
        relations: [
          "media",
          "service_offerings",
          "service_offerings.serviceOfferingMaster",
        ],
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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