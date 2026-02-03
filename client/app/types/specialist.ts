import { IBaseEntity, ISoftDeletable } from "./common";
import { ApprovalStatus, StatusType } from "./elements";
import { VerificationStatus } from "./enums";
import { IMedia } from "./media";
import { IServiceOffering } from "./service-offering";





interface ISpecialist extends IBaseEntity, ISoftDeletable {
  average_rating: number;
  is_draft: boolean;
  total_number_of_ratings: number;

  title: string;
  slug: string;
  description: string;

  base_price: number;
  platform_fee: number;
  final_price: number;

  verification_status: ApprovalStatus;
  is_verified: boolean;
  duration_days: number;

  media?: IMedia[];
  service_offerings?: IServiceOffering[];
}


export type {  ISpecialist };