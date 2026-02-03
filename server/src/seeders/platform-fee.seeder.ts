import { DataSource } from "typeorm";
import { PlatformFee } from "../entities/PlatformFee";
import { BaseSeeder } from "./base-seeder";

export class PlatformFeeSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const platformFeeRepository = this.dataSource.getRepository(PlatformFee);
    
    const platformFees = [
      {
        tier_name: "low",
        min_value: 0,
        max_value: 1000,
        platform_fee_percentage: 5.0
      },
      {
        tier_name: "medium",
        min_value: 1001,
        max_value: 5000,
        platform_fee_percentage: 7.5
      },
      {
        tier_name: "high",
        min_value: 5001,
        max_value: 20000,
        platform_fee_percentage: 10.0
      },
      {
        tier_name: "high",
        min_value: 20001,
        max_value: 100000,
        platform_fee_percentage: 12.5
      }
    ];

    for (const feeData of platformFees) {
      const fee = platformFeeRepository.create(feeData);
      await platformFeeRepository.save(fee);
      console.log(`Created platform fee tier: ${fee.tier_name}`);
    }
    
    console.log("✅ PlatformFee seeding completed!");
  }

  async truncate(): Promise<void> {
    await this.dataSource.query('TRUNCATE TABLE platform_fee RESTART IDENTITY CASCADE');
    console.log("🗑️  PlatformFee table truncated!");
  }
}