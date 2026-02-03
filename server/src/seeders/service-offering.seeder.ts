import { DataSource } from "typeorm";
import { ServiceOffering } from "../entities/ServiceOffering";
import { Specialist } from "../entities/Specialist";
import { BaseSeeder } from "./base-seeder";

export class ServiceOfferingSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const serviceOfferingRepository = this.dataSource.getRepository(ServiceOffering);
    const specialistRepository = this.dataSource.getRepository(Specialist);
    
    const specialists = await specialistRepository.find();
    
    if (specialists.length === 0) {
      console.log("⚠️  No specialists found. Please seed specialists first.");
      return;
    }
    
    const serviceOfferingNames = [
      "Initial Consultation",
      "Project Setup & Architecture",
      "Core Development",
      "Testing & Quality Assurance",
      "Deployment & Launch",
      "Maintenance & Support",
      "Code Review",
      "Performance Optimization",
      "Security Audit",
      "Training & Documentation"
    ];
    
    let offeringCounter = 1;
    
    for (const specialist of specialists) {
      // Create 3-5 service offerings per specialist
      const numOfferings = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numOfferings; i++) {
        const serviceOffering = serviceOfferingRepository.create({
          specialist: specialist,
          // Add some fields if you extend the entity later
        });
        
        await serviceOfferingRepository.save(serviceOffering);
        offeringCounter++;
      }
      
      console.log(`Created ${numOfferings} service offerings for specialist: ${specialist.title}`);
    }
    
    console.log(`✅ ServiceOffering seeding completed! Created ${offeringCounter - 1} offerings.`);
  }

  async truncate(): Promise<void> {
    await this.dataSource.query('TRUNCATE TABLE service_offerings RESTART IDENTITY CASCADE');
    console.log("🗑️  ServiceOffering table truncated!");
  }
}