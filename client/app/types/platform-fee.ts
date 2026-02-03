import { IBaseEntity } from "./common";
import { PlatformFeeTier } from "./enums";

export interface IPlatformFee extends IBaseEntity {
  tier_name: PlatformFeeTier;
  min_value: number;
  max_value: number;
  platform_fee_percentage: number;
}
