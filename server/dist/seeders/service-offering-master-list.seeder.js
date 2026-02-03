"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOfferingMasterListSeeder = void 0;
const ServiceOfferingMasterList_1 = require("../entities/ServiceOfferingMasterList");
const base_seeder_1 = require("./base-seeder");
class ServiceOfferingMasterListSeeder extends base_seeder_1.BaseSeeder {
    async seed() {
        const masterRepo = this.dataSource.getRepository(ServiceOfferingMasterList_1.ServiceOfferingMasterList);
        const existingCount = await masterRepo.count();
        if (existingCount > 0) {
            console.log("ℹ️  ServiceOfferingMasterList already seeded. Skipping...");
            return;
        }
        const masterServices = [
            {
                title: "Initial Consultation",
                description: "Understanding requirements, scope, and technical feasibility.",
            },
            {
                title: "Project Setup & Architecture",
                description: "Project bootstrapping, system design, and architecture planning.",
            },
            {
                title: "Core Development",
                description: "Implementation of core features and business logic.",
            },
            {
                title: "Testing & Quality Assurance",
                description: "Unit tests, integration tests, and overall quality checks.",
            },
            {
                title: "Deployment & Launch",
                description: "Production deployment, CI/CD setup, and release support.",
            },
            {
                title: "Maintenance & Support",
                description: "Ongoing bug fixes, updates, and technical support.",
            },
            {
                title: "Code Review",
                description: "Reviewing code quality, security, and best practices.",
            },
            {
                title: "Performance Optimization",
                description: "Improving speed, scalability, and resource usage.",
            },
            {
                title: "Security Audit",
                description: "Identifying vulnerabilities and improving system security.",
            },
            {
                title: "Training & Documentation",
                description: "Knowledge transfer, onboarding, and technical documentation.",
            },
        ];
        const masters = masterServices.map(service => masterRepo.create({
            title: service.title,
            description: service.description,
            bucket_name: "service-offerings", // required column
            s3_key: undefined,
        }));
        await masterRepo.save(masters);
        console.log(`✅ ServiceOfferingMasterList seeding completed! Created ${masters.length} master services.`);
    }
    async truncate() {
        await this.dataSource.query("TRUNCATE TABLE service_offerings_master_list RESTART IDENTITY CASCADE");
        console.log("🗑️  ServiceOfferingMasterList table truncated!");
    }
}
exports.ServiceOfferingMasterListSeeder = ServiceOfferingMasterListSeeder;
