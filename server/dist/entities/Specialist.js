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
exports.Specialist = void 0;
const typeorm_1 = require("typeorm");
const Media_1 = require("./Media");
const ServiceOffering_1 = require("./ServiceOffering");
let Specialist = class Specialist {
};
exports.Specialist = Specialist;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Specialist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", default: 0 }),
    __metadata("design:type", Number)
], Specialist.prototype, "average_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Specialist.prototype, "is_draft", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Specialist.prototype, "total_number_of_ratings", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Specialist.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Specialist.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Specialist.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Specialist.prototype, "base_price", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Specialist.prototype, "platform_fee", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Specialist.prototype, "final_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["pending", "approved", "rejected"] }),
    __metadata("design:type", String)
], Specialist.prototype, "verification_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Specialist.prototype, "is_verified", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], Specialist.prototype, "duration_days", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Media_1.Media, media => media.specialist, {
        cascade: true, // This will delete related media when specialist is removed
        onDelete: 'CASCADE' // Database-level cascade
    }),
    __metadata("design:type", Array)
], Specialist.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ServiceOffering_1.ServiceOffering, so => so.specialist, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", Array)
], Specialist.prototype, "service_offerings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Specialist.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Specialist.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Specialist.prototype, "deleted_at", void 0);
exports.Specialist = Specialist = __decorate([
    (0, typeorm_1.Entity)("specialists")
], Specialist);
