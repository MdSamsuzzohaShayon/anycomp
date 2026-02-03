import { DataSource } from "typeorm";
import { Specialist } from "../entities/Specialist";
import { PlatformFee } from "../entities/PlatformFee";
import { BaseSeeder } from "./base-seeder";

export class SpecialistSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const specialistRepository = this.dataSource.getRepository(Specialist);
    const platformFeeRepository = this.dataSource.getRepository(PlatformFee);
    
    const specialists = [
      {
        title: "Web Development Expert",
        slug: "web-development-expert",
        description: "Full-stack web developer with 8+ years of experience in React, Node.js, and PostgreSQL. I build scalable web applications with clean code and modern architectures.",
        base_price: 1500.00,
        duration_days: 14,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.8,
        total_number_of_ratings: 47,
        is_draft: false
      },
      {
        title: "Mobile App Developer",
        slug: "mobile-app-developer",
        description: "iOS & Android app developer specializing in React Native and Flutter. I create beautiful, performant mobile applications for startups and enterprises.",
        base_price: 2000.00,
        duration_days: 21,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.9,
        total_number_of_ratings: 32,
        is_draft: false
      },
      {
        title: "UI/UX Designer",
        slug: "ui-ux-designer",
        description: "Creative UI/UX designer with a focus on user-centered design. I create intuitive interfaces and engaging user experiences for web and mobile applications.",
        base_price: 1200.00,
        duration_days: 10,
        verification_status: "pending",
        is_verified: false,
        average_rating: 4.6,
        total_number_of_ratings: 18,
        is_draft: false
      },
      {
        title: "DevOps Engineer",
        slug: "devops-engineer",
        description: "DevOps specialist with expertise in AWS, Docker, Kubernetes, and CI/CD pipelines. I help teams implement robust deployment strategies and infrastructure.",
        base_price: 2500.00,
        duration_days: 30,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.7,
        total_number_of_ratings: 24,
        is_draft: false
      },
      {
        title: "Data Scientist",
        slug: "data-scientist",
        description: "Data scientist specializing in machine learning, statistical analysis, and data visualization using Python, R, and TensorFlow.",
        base_price: 3000.00,
        duration_days: 28,
        verification_status: "rejected",
        is_verified: false,
        average_rating: 0,
        total_number_of_ratings: 0,
        is_draft: true
      }
    ];

    // Calculate platform fees based on base price
    const allFees = await platformFeeRepository.find();
    
    for (const specData of specialists) {
      // Find appropriate platform fee tier
      const feeTier = allFees.find(fee => 
        specData.base_price >= fee.min_value && specData.base_price <= fee.max_value
      ) || allFees[0];
      
      const platformFee = (specData.base_price * feeTier.platform_fee_percentage) / 100;
      const finalPrice = specData.base_price + platformFee;
      
      const specialist = specialistRepository.create({
        ...specData,
        platform_fee: platformFee,
        final_price: finalPrice
      });
      
      await specialistRepository.save(specialist);
      console.log(`Created specialist: ${specialist.title}`);
    }
    
    console.log("✅ Specialist seeding completed!");
  }

  async truncate(): Promise<void> {
    await this.dataSource.query('TRUNCATE TABLE specialists RESTART IDENTITY CASCADE');
    console.log("🗑️  Specialist table truncated!");
  }
}