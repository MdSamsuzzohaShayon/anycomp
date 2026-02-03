import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { ServiceOffering } from "./ServiceOffering";
  
  @Entity("service_offerings_master_list")
  export class ServiceOfferingMasterList {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column()
    title!: string;
  
    @Column("text")
    description!: string;
  
    @Column({ nullable: true })
    s3_key?: string;
  
    @Column()
    bucket_name!: string;
  
    @OneToMany(
      () => ServiceOffering,
      serviceOffering => serviceOffering.serviceOfferingMaster
    )
    service_offerings!: ServiceOffering[];
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  