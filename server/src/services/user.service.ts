// src/services/user.service.ts
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export class UserService {
  private repo: Repository<User> = AppDataSource.getRepository(User);

  async register(email: string, password: string, role: UserRole = "user"): Promise<User> {
    const existing = await this.repo.findOneBy({ email });
    if (existing) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hashed, role });
    return await this.repo.save(user);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.repo.findOneBy({ email });
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign({ userId: user.id, role: user.role } as JwtPayload, JWT_SECRET, {
      expiresIn: "1h",
    });

    return { user, token };
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.repo.findOneBy({ email });
    if (!user) throw new Error("User not found");
    return true; // in real app, send email token
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<User> {
    const user = await this.repo.findOneBy({ id: userId });
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new Error("Old password is incorrect");

    user.password = await bcrypt.hash(newPassword, 10);
    return await this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }
}
