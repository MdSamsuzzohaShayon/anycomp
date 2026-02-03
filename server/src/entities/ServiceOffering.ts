import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Specialist } from "./Specialist";
import { ServiceOfferingMasterList } from "./ServiceOfferingMasterList";

@Entity("service_offerings")
export class ServiceOffering {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(
    () => Specialist,
    specialist => specialist.service_offerings,
    { onDelete: "CASCADE" }
  )
  specialist!: Specialist;

  @ManyToOne(
    () => ServiceOfferingMasterList,
    service => service.service_offerings,
    { onDelete: "CASCADE" }
  )
  serviceOfferingMaster!: ServiceOfferingMasterList;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
