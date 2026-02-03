"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformFeeService = void 0;
const data_source_1 = require("../data-source");
const PlatformFee_1 = require("../entities/PlatformFee");
class PlatformFeeService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(PlatformFee_1.PlatformFee);
    }
    create(data) {
        const platformFee = this.repo.create(data);
        return this.repo.save(platformFee);
    }
    findAll() {
        return this.repo.find({
            order: { min_value: "ASC" }
        });
    }
    findById(id) {
        return this.repo.findOne({
            where: { id }
        });
    }
    async calculateFee(amount) {
        const fee = await this.repo.findOne({
            where: {
                min_value: amount >= 0 ? amount : 0,
                max_value: amount >= 0 ? amount : 0
            }
        });
        if (!fee) {
            // Find the tier where amount falls between min and max
            const tier = await this.repo.createQueryBuilder("platform_fee")
                .where(":amount >= platform_fee.min_value AND :amount <= platform_fee.max_value", { amount })
                .getOne();
            if (tier) {
                return {
                    tier_name: tier.tier_name,
                    platform_fee_percentage: tier.platform_fee_percentage,
                    fee_amount: (amount * tier.platform_fee_percentage) / 100,
                    original_amount: amount,
                    final_amount: amount + (amount * tier.platform_fee_percentage) / 100
                };
            }
            return null;
        }
        return {
            tier_name: fee.tier_name,
            platform_fee_percentage: fee.platform_fee_percentage,
            fee_amount: (amount * fee.platform_fee_percentage) / 100,
            original_amount: amount,
            final_amount: amount + (amount * fee.platform_fee_percentage) / 100
        };
    }
    update(id, data) {
        return this.repo.update(id, data).then(() => this.findById(id));
    }
    delete(id) {
        return this.repo.delete(id);
    }
}
exports.PlatformFeeService = PlatformFeeService;
