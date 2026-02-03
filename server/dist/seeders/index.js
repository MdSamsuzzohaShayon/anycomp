"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seeder = void 0;
const data_source_1 = require("../data-source");
const platform_fee_seeder_1 = require("./platform-fee.seeder");
const specialist_seeder_1 = require("./specialist.seeder");
const service_offering_seeder_1 = require("./service-offering.seeder");
const media_seeder_1 = require("./media.seeder");
const service_offering_master_list_seeder_1 = require("./service-offering-master-list.seeder");
class Seeder {
    constructor() {
        this.dataSource = data_source_1.AppDataSource;
        this.seeders = [
            new platform_fee_seeder_1.PlatformFeeSeeder(this.dataSource),
            new specialist_seeder_1.SpecialistSeeder(this.dataSource),
            new service_offering_seeder_1.ServiceOfferingSeeder(this.dataSource),
            new media_seeder_1.MediaSeeder(this.dataSource),
            new service_offering_master_list_seeder_1.ServiceOfferingMasterListSeeder(this.dataSource),
        ];
    }
    async seedAll() {
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
        }
        catch (error) {
            console.error("❌ Seeding failed:", error);
            throw error;
        }
    }
    async truncateAll() {
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
        }
        catch (error) {
            console.error("❌ Truncation failed:", error);
            throw error;
        }
    }
    async refresh() {
        await this.truncateAll();
        await this.seedAll();
    }
    async seedSpecific(seederName) {
        try {
            console.log(`🌱 Running specific seeder: ${seederName}...`);
            // Connect to database
            if (!this.dataSource.isInitialized) {
                await this.dataSource.initialize();
            }
            const seeder = this.seeders.find(s => s.constructor.name.toLowerCase().includes(seederName.toLowerCase()));
            if (!seeder) {
                console.error(`❌ Seeder "${seederName}" not found. Available seeders:`);
                this.seeders.forEach(s => console.log(`  - ${s.constructor.name}`));
                return;
            }
            await seeder.seed();
            console.log(`✅ ${seeder.constructor.name} completed!`);
        }
        catch (error) {
            console.error("❌ Specific seeding failed:", error);
            throw error;
        }
    }
}
exports.Seeder = Seeder;
