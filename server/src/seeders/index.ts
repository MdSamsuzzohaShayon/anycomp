import { AppDataSource } from "../data-source";
import { PlatformFeeSeeder } from "./platform-fee.seeder";
import { SpecialistSeeder } from "./specialist.seeder";
import { ServiceOfferingSeeder } from "./service-offering.seeder";
import { MediaSeeder } from "./media.seeder";
import { ServiceOfferingMasterListSeeder } from "./service-offering-master-list.seeder";

export class Seeder {
  private dataSource = AppDataSource;
  
  private seeders = [
    new PlatformFeeSeeder(this.dataSource),
    new SpecialistSeeder(this.dataSource),
    new ServiceOfferingSeeder(this.dataSource),
    new MediaSeeder(this.dataSource),
    new ServiceOfferingMasterListSeeder(this.dataSource),
  ];

  async seedAll(): Promise<void> {
    try {
      console.log("🚀 Starting database seeding...");
      
      // Connect to database
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        console.log("📦 Database connected!");
      }
      
      // Run seeders in order (respecting foreign key constraints)
      for (const seeder of this.seeders) {
        console.log(`\n🌱 Running ${seeder.constructor.name}...`);
        await seeder.seed();
      }
      
      console.log("\n🎉 All seeders completed successfully!");
      
    } catch (error) {
      console.error("❌ Seeding failed:", error);
      throw error;
    }
  }

  async truncateAll(): Promise<void> {
    try {
      console.log("🗑️  Starting database truncation...");
      
      // Connect to database
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      
      // Run truncate in reverse order (respecting foreign key constraints)
      for (let i = this.seeders.length - 1; i >= 0; i--) {
        console.log(`\n🗑️  Truncating ${this.seeders[i].constructor.name}...`);
        await this.seeders[i].truncate();
      }
      
      console.log("\n✅ All tables truncated!");
      
    } catch (error) {
      console.error("❌ Truncation failed:", error);
      throw error;
    }
  }

  async refresh(): Promise<void> {
    await this.truncateAll();
    await this.seedAll();
  }

  async seedSpecific(seederName: string): Promise<void> {
    try {
      console.log(`🌱 Running specific seeder: ${seederName}...`);
      
      // Connect to database
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      
      const seeder = this.seeders.find(s => 
        s.constructor.name.toLowerCase().includes(seederName.toLowerCase())
      );
      
      if (!seeder) {
        console.error(`❌ Seeder "${seederName}" not found. Available seeders:`);
        this.seeders.forEach(s => console.log(`  - ${s.constructor.name}`));
        return;
      }
      
      await seeder.seed();
      console.log(`✅ ${seeder.constructor.name} completed!`);
      
    } catch (error) {
      console.error("❌ Specific seeding failed:", error);
      throw error;
    }
  }
}