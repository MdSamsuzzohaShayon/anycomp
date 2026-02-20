import { IBaseEntity, ISoftDeletable } from "./common";
import { ApprovalStatus, StatusType } from "./elements";
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



interface IBaseData {
  title: string;
  description: string;
  duration_days: number;
  services: string[];
  images: File[];
  is_draft: boolean;
} 

interface ISpecialistFormData extends IBaseData{
  currency: string;
  amount: number;
}

interface ICreateSpecialist extends IBaseData{
  base_price: number;
}




export type {  ISpecialist, ISpecialistFormData, ICreateSpecialist };