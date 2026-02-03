import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";
import { Specialist } from "./Specialist";

@Entity("media")
export class Media {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Specialist, specialist => specialist.media)
  specialist!: Specialist;

  @Column()
  file_name!: string;

  @Column("int")
  file_size!: number;

  @Column("int")
  display_order!: number;

  @Column({ type: "enum", enum: ["image", "video"] })
  media_type!: string;

  @Column({ type: "enum", enum: ["image/jpeg", "image/png", "video/mp4"] })
  mime_type!: string;

  @CreateDateColumn()
  uploaded_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
