import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./config/env";
import { Specialist } from "./entities/Specialist";
import { User } from "./entities/User";
import { Media } from "./entities/Media";
import { PlatformFee } from "./entities/PlatformFee";
import { ServiceOffering } from "./entities/ServiceOffering";
import { ServiceOfferingMasterList } from "./entities/ServiceOfferingMasterList";

const isProd = env.node_env === "production";

export const AppDataSource = new DataSource({
  type: "postgres",

  ...(isProd
    ? {
        // ✅ Render / Production
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        // ✅ Local development
        host: env.db.host,
        port: env.db.port,
        username: env.db.user,
        password: env.db.pass,
        database: env.db.name,
      }),

  synchronize: true, // ❗ false if using migrations
  logging: false,

  entities: [
    User,
    Specialist,
    Media,
    PlatformFee,
    ServiceOffering,
    ServiceOfferingMasterList,
  ],
});
