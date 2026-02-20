import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { BaseSeeder } from "./base-seeder";
import * as bcrypt from "bcryptjs";
import { env } from "../config/env";

export class UserSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    const email = env.admin.email;
    // Check if a user already exists
    const existingUser = await userRepository.findOne({where: {email}});
    if (existingUser) {
      console.log("⚠️  User already exists. Skipping seeding.");
      return;
    }

    // Sample user
    const hashed = await bcrypt.hash(String(env.admin.password), 10);
    const sampleUser = {
      email,
      password: hashed, // hashed password
      role: "admin" as const, // type-safe
      is_active: true,
      is_email_verified: true,
    };


    const user = userRepository.create(sampleUser);
    await userRepository.save(user);

    console.log(`✅ User created: ${sampleUser.email}`);
  }

  async truncate(): Promise<void> {
    await this.dataSource.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');
    console.log("🗑️  Users table truncated!");
  }
}
