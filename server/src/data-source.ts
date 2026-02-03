import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./config/env";
import { Specialist } from "./entities/Specialist";
import { User } from "./entities/User";
import { Media } from "./entities/Media";
import { PlatformFee } from "./entities/PlatformFee";
import { ServiceOffering } from "./entities/ServiceOffering";
import { ServiceOfferingMasterList } from "./entities/ServiceOfferingMasterList";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  synchronize: true, // ❗ false in production
  logging: false,
  entities: [User, Specialist, Media, PlatformFee, ServiceOffering, ServiceOfferingMasterList],
});
