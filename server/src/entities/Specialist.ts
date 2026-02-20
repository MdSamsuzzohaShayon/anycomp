import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";
import { Media } from "./Media";
import { ServiceOffering } from "./ServiceOffering";

export enum ESpecialistVerificationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity("specialists")
export class Specialist {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "decimal", default: 0 })
  average_rating!: number;

  @Column({ default: false })
  is_draft!: boolean;

  @Column({ type: "int", default: 0 })
  total_number_of_ratings!: number;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column("text")
  description!: string;

  @Column("decimal")
  base_price!: number;

  @Column({ type: "decimal", default: 0 })
  platform_fee!: number;

  @Column("decimal")
  final_price!: number;

  @Column({
    type: "enum",
    enum: ESpecialistVerificationStatus,
    default: ESpecialistVerificationStatus.PENDING,
  })
  verification_status!: ESpecialistVerificationStatus;

  @Column({ default: false })
  is_verified!: boolean;

  @Column("int")
  duration_days!: number;

  // Add cascade options
  @OneToMany(() => Media, media => media.specialist, {
    cascade: true, // This will delete related media when specialist is removed
    onDelete: 'CASCADE' // Database-level cascade
  })
  media!: Media[];

  @OneToMany(() => ServiceOffering, so => so.specialist, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  service_offerings!: ServiceOffering[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
