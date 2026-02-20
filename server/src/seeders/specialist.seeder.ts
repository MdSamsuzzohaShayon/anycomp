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
        title: "Backend Engineer",
        slug: "backend-engineer",
        description: "Builds secure APIs and scalable services.",
        base_price: 1700.00,
        duration_days: 15,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.7,
        total_number_of_ratings: 21,
        is_draft: false
      },
      {
        title: "React Frontend Developer",
        slug: "react-frontend-developer",
        description: "Creates fast, modern web interfaces.",
        base_price: 1300.00,
        duration_days: 12,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.8,
        total_number_of_ratings: 34,
        is_draft: false
      },
      {
        title: "Full Stack Developer",
        slug: "full-stack-developer",
        description: "Handles both frontend and backend systems.",
        base_price: 2100.00,
        duration_days: 18,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.9,
        total_number_of_ratings: 27,
        is_draft: false
      },
      {
        title: "WordPress Developer",
        slug: "wordpress-developer",
        description: "Builds themes, plugins, and CMS sites.",
        base_price: 950.00,
        duration_days: 8,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.5,
        total_number_of_ratings: 44,
        is_draft: false
      },
      {
        title: "Shopify Expert",
        slug: "shopify-expert",
        description: "Creates high-converting online stores.",
        base_price: 1600.00,
        duration_days: 14,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.8,
        total_number_of_ratings: 19,
        is_draft: false
      },
      {
        title: "QA Engineer",
        slug: "qa-engineer",
        description: "Tests apps and ensures product quality.",
        base_price: 1100.00,
        duration_days: 11,
        verification_status: "pending",
        is_verified: false,
        average_rating: 4.4,
        total_number_of_ratings: 13,
        is_draft: false
      },
      {
        title: "Security Specialist",
        slug: "security-specialist",
        description: "Finds vulnerabilities and secures systems.",
        base_price: 3400.00,
        duration_days: 26,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.9,
        total_number_of_ratings: 16,
        is_draft: false
      },
      {
        title: "AWS Cloud Engineer",
        slug: "aws-cloud-engineer",
        description: "Designs and manages cloud infrastructure.",
        base_price: 3600.00,
        duration_days: 28,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.8,
        total_number_of_ratings: 12,
        is_draft: false
      },
      {
        title: "ML Engineer",
        slug: "ml-engineer",
        description: "Builds and deploys ML models.",
        base_price: 3100.00,
        duration_days: 23,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.7,
        total_number_of_ratings: 14,
        is_draft: false
      },
      {
        title: "API Integration Expert",
        slug: "api-integration-expert",
        description: "Connects services and third-party APIs.",
        base_price: 1500.00,
        duration_days: 12,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.6,
        total_number_of_ratings: 20,
        is_draft: false
      },
      {
        title: "Database Engineer",
        slug: "database-engineer",
        description: "Optimizes and maintains databases.",
        base_price: 2000.00,
        duration_days: 17,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.7,
        total_number_of_ratings: 18,
        is_draft: false
      },
      {
        title: "System Architect",
        slug: "system-architect",
        description: "Designs scalable software systems.",
        base_price: 3900.00,
        duration_days: 30,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.9,
        total_number_of_ratings: 10,
        is_draft: false
      },
      {
        title: "Performance Engineer",
        slug: "performance-engineer",
        description: "Improves speed and reliability.",
        base_price: 1750.00,
        duration_days: 14,
        verification_status: "pending",
        is_verified: false,
        average_rating: 4.5,
        total_number_of_ratings: 9,
        is_draft: false
      },
      {
        title: "Unity Game Developer",
        slug: "unity-game-developer",
        description: "Develops engaging games in Unity.",
        base_price: 2400.00,
        duration_days: 22,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.6,
        total_number_of_ratings: 17,
        is_draft: false
      },
      {
        title: "SEO Consultant",
        slug: "seo-consultant",
        description: "Boosts rankings and traffic.",
        base_price: 750.00,
        duration_days: 9,
        verification_status: "approved",
        is_verified: false,
        average_rating: 4.4,
        total_number_of_ratings: 41,
        is_draft: false
      },
      {
        title: "Content Writer",
        slug: "content-writer",
        description: "Writes clear and engaging content.",
        base_price: 600.00,
        duration_days: 7,
        verification_status: "pending",
        is_verified: false,
        average_rating: 4.3,
        total_number_of_ratings: 25,
        is_draft: false
      },
      {
        title: "Product Consultant",
        slug: "product-consultant",
        description: "Helps refine product strategy.",
        base_price: 2800.00,
        duration_days: 19,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.8,
        total_number_of_ratings: 11,
        is_draft: false
      },
      {
        title: "Automation Specialist",
        slug: "automation-specialist",
        description: "Automates workflows and processes.",
        base_price: 1250.00,
        duration_days: 10,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.6,
        total_number_of_ratings: 22,
        is_draft: false
      },
      {
        title: "Technical Support Engineer",
        slug: "technical-support-engineer",
        description: "Resolves technical issues quickly.",
        base_price: 650.00,
        duration_days: 6,
        verification_status: "pending",
        is_verified: false,
        average_rating: 4.2,
        total_number_of_ratings: 28,
        is_draft: false
      },
      {
        title: "Microservices Developer",
        slug: "microservices-developer",
        description: "Builds distributed service architectures.",
        base_price: 2300.00,
        duration_days: 20,
        verification_status: "approved",
        is_verified: true,
        average_rating: 4.7,
        total_number_of_ratings: 16,
        is_draft: false
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