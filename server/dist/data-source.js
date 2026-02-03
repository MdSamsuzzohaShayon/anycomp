"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const env_1 = require("./config/env");
const Specialist_1 = require("./entities/Specialist");
const User_1 = require("./entities/User");
const Media_1 = require("./entities/Media");
const PlatformFee_1 = require("./entities/PlatformFee");
const ServiceOffering_1 = require("./entities/ServiceOffering");
const ServiceOfferingMasterList_1 = require("./entities/ServiceOfferingMasterList");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: env_1.env.db.host,
    port: env_1.env.db.port,
    username: env_1.env.db.user,
    password: env_1.env.db.pass,
    database: env_1.env.db.name,
    synchronize: true, // ❗ false in production
    logging: false,
    entities: [User_1.User, Specialist_1.Specialist, Media_1.Media, PlatformFee_1.PlatformFee, ServiceOffering_1.ServiceOffering, ServiceOfferingMasterList_1.ServiceOfferingMasterList],
});
