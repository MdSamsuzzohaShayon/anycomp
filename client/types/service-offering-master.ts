import { IBaseEntity } from "./common";
import { IServiceOffering } from "./service-offering";

export interface IServiceOfferingMasterList extends IBaseEntity {
  title: string;
  description: string;
  s3_key?: string | null;
  bucket_name: string;

  service_offerings?: IServiceOffering[];
}
