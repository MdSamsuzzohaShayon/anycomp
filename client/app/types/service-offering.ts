import { IBaseEntity } from "./common";
import { ISpecialist } from "./specialist";
import { IServiceOfferingMasterList } from "./service-offering-master";

export interface IServiceOffering extends IBaseEntity {
  specialist?: ISpecialist;
  serviceOfferingMaster?: IServiceOfferingMasterList;
}


