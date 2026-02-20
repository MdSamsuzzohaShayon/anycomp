import { DataSource } from "typeorm";
import { ServiceOfferingMasterList } from "../entities/ServiceOfferingMasterList";
import { BaseSeeder } from "./base-seeder";

export class ServiceOfferingMasterListSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const masterRepo = this.dataSource.getRepository(
      ServiceOfferingMasterList
    );

    const existingCount = await masterRepo.count();
    if (existingCount > 0) {
      console.log("ℹ️  ServiceOfferingMasterList already seeded. Skipping...");
      return;
    }

    const masterServices = [
      {
        title: "Company Secretary Subscription",
        description: "Enjoy 1 month free Company Secretary Subscription",
        // image: human icon 
      },
      {
        title: "Opening of a Bank Account",
        description: "Complimentary Corporate Bank Account Opening",
        // image: bank icon 
      },
      {
        title: "Access Company Records and SSM Forms",
        description: "24/7 Secure Access to Statutory Company Records",
        // image: record icon 
      },
      {
        title: "Priority Filling",
        description: "Documents are prioritized for submission and swift processing - within 24 hours",
        // image: Light icon 
      },
      {
        title: "Registered Office Address Use",
        description: "Use of SSM-Compliant Registered Office Address with Optional Mail Forwarding",
        // image: Location icon 
      },
      {
        title: "Compliance Calendar Setup",
        description: "Get automated reminders for all statutory deadlines",
        // image: Calender icon 
      },
      {
        title: "First Share Certificate Issued Free",
        description: "Receive your company’s first official share certificate at no cost ",
        // image: Badge icon 
      },
      {
        title: "CTC Delivery & Courier Handling",
        description: "Have your company documents and certified copies delivered securely to you",
        // image: Car icon 
      },
      {
        title: "Chat Support",
        description: "Always-On Chat Support for Compliance, Filing, and General Queries",
        // image: Headphone icon 
      }
    ];

    const masters = masterServices.map(service =>
      masterRepo.create({
        title: service.title,
        description: service.description,
        bucket_name: "service-offerings", // required column
        s3_key: undefined,
      })
    );

    await masterRepo.save(masters);

    console.log(
      `✅ ServiceOfferingMasterList seeding completed! Created ${masters.length} master services.`
    );
  }

  async truncate(): Promise<void> {
    await this.dataSource.query(
      "TRUNCATE TABLE service_offerings_master_list RESTART IDENTITY CASCADE"
    );
    console.log("🗑️  ServiceOfferingMasterList table truncated!");
  }
}
