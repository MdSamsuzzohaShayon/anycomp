"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOffering = void 0;
const typeorm_1 = require("typeorm");
const Specialist_1 = require("./Specialist");
const ServiceOfferingMasterList_1 = require("./ServiceOfferingMasterList");
let ServiceOffering = class ServiceOffering {
};
exports.ServiceOffering = ServiceOffering;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ServiceOffering.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Specialist_1.Specialist, specialist => specialist.service_offerings, { onDelete: "CASCADE" }),
    __metadata("design:type", Specialist_1.Specialist)
], ServiceOffering.prototype, "specialist", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ServiceOfferingMasterList_1.ServiceOfferingMasterList, service => service.service_offerings, { onDelete: "CASCADE" }),
    __metadata("design:type", ServiceOfferingMasterList_1.ServiceOfferingMasterList)
], ServiceOffering.prototype, "serviceOfferingMaster", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ServiceOffering.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ServiceOffering.prototype, "updated_at", void 0);
exports.ServiceOffering = ServiceOffering = __decorate([
    (0, typeorm_1.Entity)("service_offerings")
], ServiceOffering);
