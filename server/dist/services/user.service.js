"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
class UserService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async register(email, password, role = "user") {
        const existing = await this.repo.findOneBy({ email });
        if (existing)
            throw new Error("Email already exists");
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = this.repo.create({ email, password: hashed, role });
        return await this.repo.save(user);
    }
    async login(email, password) {
        const user = await this.repo.findOneBy({ email });
        if (!user)
            throw new Error("Invalid credentials");
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "1h",
        });
        return { user, token };
    }
    async forgotPassword(email) {
        const user = await this.repo.findOneBy({ email });
        if (!user)
            throw new Error("User not found");
        return true; // in real app, send email token
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.repo.findOneBy({ id: userId });
        if (!user)
            throw new Error("User not found");
        const valid = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!valid)
            throw new Error("Old password is incorrect");
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        return await this.repo.save(user);
    }
    async findAll() {
        return await this.repo.find();
    }
}
exports.UserService = UserService;
