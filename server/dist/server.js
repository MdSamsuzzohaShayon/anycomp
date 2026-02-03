"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const data_source_1 = require("./data-source");
const env_1 = require("./config/env");
data_source_1.AppDataSource.initialize()
    .then(() => {
    app_1.default.listen(env_1.env.port, () => {
        console.log(`🚀 Server running on port ${env_1.env.port}`);
    });
})
    .catch(console.error);
