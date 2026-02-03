import { DataSource } from "typeorm";
import { Media } from "../entities/Media";
import { Specialist } from "../entities/Specialist";
import { BaseSeeder } from "./base-seeder";

export class MediaSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const mediaRepository = this.dataSource.getRepository(Media);
    const specialistRepository = this.dataSource.getRepository(Specialist);
    
    const specialists = await specialistRepository.find();
    
    if (specialists.length === 0) {
      console.log("⚠️  No specialists found. Please seed specialists first.");
      return;
    }
    
    const sampleMedia = [
      // Web Development Specialist
      {
        file_name: "web-project-1.jpg",
        file_size: 2048000,
        display_order: 1,
        media_type: "image",
        mime_type: "image/jpeg"
      },
      {
        file_name: "web-project-2.jpg",
        file_size: 1843200,
        display_order: 2,
        media_type: "image",
        mime_type: "image/jpeg"
      },
      {
        file_name: "web-demo.mp4",
        file_size: 15728640,
        display_order: 3,
        media_type: "video",
        mime_type: "video/mp4"
      },
      // Mobile App Specialist
      {
        file_name: "mobile-app-ui.png",
        file_size: 1536000,
        display_order: 1,
        media_type: "image",
        mime_type: "image/png"
      },
      {
        file_name: "app-demo.mp4",
        file_size: 20971520,
        display_order: 2,
        media_type: "video",
        mime_type: "video/mp4"
      },
      // UI/UX Designer
      {
        file_name: "design-portfolio-1.jpg",
        file_size: 2560000,
        display_order: 1,
        media_type: "image",
        mime_type: "image/jpeg"
      },
      {
        file_name: "design-portfolio-2.jpg",
        file_size: 2304000,
        display_order: 2,
        media_type: "image",
        mime_type: "image/jpeg"
      },
      {
        file_name: "design-portfolio-3.jpg",
        file_size: 1920000,
        display_order: 3,
        media_type: "image",
        mime_type: "image/jpeg"
      },
      // DevOps Engineer
      {
        file_name: "infrastructure-diagram.png",
        file_size: 1024000,
        display_order: 1,
        media_type: "image",
        mime_type: "image/png"
      },
      {
        file_name: "ci-cd-pipeline.mp4",
        file_size: 12582912,
        display_order: 2,
        media_type: "video",
        mime_type: "video/mp4"
      }
    ];
    
    let mediaIndex = 0;
    
    for (const specialist of specialists) {
      // Create 2-3 media items per specialist
      const numMedia = specialist.verification_status === "approved" ? 3 : 2;
      
      for (let i = 0; i < numMedia; i++) {
        if (mediaIndex >= sampleMedia.length) {
          mediaIndex = 0; // Loop back to start if we run out of sample media
        }
        
        const mediaData = sampleMedia[mediaIndex];
        const media = mediaRepository.create({
          ...mediaData,
          specialist: specialist
        });
        
        await mediaRepository.save(media);
        mediaIndex++;
      }
      
      console.log(`Created ${numMedia} media items for specialist: ${specialist.title}`);
    }
    
    console.log("✅ Media seeding completed!");
  }

  async truncate(): Promise<void> {
    await this.dataSource.query('TRUNCATE TABLE media RESTART IDENTITY CASCADE');
    console.log("🗑️  Media table truncated!");
  }
}