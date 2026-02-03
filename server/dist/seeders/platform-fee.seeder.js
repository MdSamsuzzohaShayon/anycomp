"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformFeeSeeder = void 0;
const PlatformFee_1 = require("../entities/PlatformFee");
const base_seeder_1 = require("./base-seeder");
class PlatformFeeSeeder extends base_seeder_1.BaseSeeder {
    async seed() {
        const platformFeeRepository = this.dataSource.getRepository(PlatformFee_1.PlatformFee);
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
    async truncate() {
        await this.dataSource.query('TRUNCATE TABLE platform_fee RESTART IDENTITY CASCADE');
        console.log("🗑️  PlatformFee table truncated!");
    }
}
exports.PlatformFeeSeeder = PlatformFeeSeeder;
