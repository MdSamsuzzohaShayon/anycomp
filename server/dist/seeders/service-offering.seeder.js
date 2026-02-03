"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOfferingSeeder = void 0;
const ServiceOffering_1 = require("../entities/ServiceOffering");
const Specialist_1 = require("../entities/Specialist");
const base_seeder_1 = require("./base-seeder");
class ServiceOfferingSeeder extends base_seeder_1.BaseSeeder {
    async seed() {
        const serviceOfferingRepository = this.dataSource.getRepository(ServiceOffering_1.ServiceOffering);
        const specialistRepository = this.dataSource.getRepository(Specialist_1.Specialist);
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
    async truncate() {
        await this.dataSource.query('TRUNCATE TABLE service_offerings RESTART IDENTITY CASCADE');
        console.log("🗑️  ServiceOffering table truncated!");
    }
}
exports.ServiceOfferingSeeder = ServiceOfferingSeeder;
