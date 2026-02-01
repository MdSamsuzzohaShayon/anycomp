import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Specialist } from "./Specialist";
  
  @Entity("service_offerings")
  export class ServiceOffering {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @ManyToOne(() => Specialist, specialist => specialist.service_offerings)
    specialist!: Specialist;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  