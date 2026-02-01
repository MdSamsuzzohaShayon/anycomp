// src/controllers/user.controller.ts
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { UserService } from "../services/user.service";
import { RegisterInput, LoginInput, ChangePasswordInput } from "../types/auth";

const service = new UserService();

export const registerUser = async (req: { body: RegisterInput }, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const user = await service.register(email, password, role);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const loginUser = async (req: { body: LoginInput }, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    res.json({ message: "Login successful", ...result });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req: { body: { email: string } }, res: Response) => {
  try {
    const { email } = req.body;
    await service.forgotPassword(email);
    res.json({ message: "If this email exists, a reset link has been sent." });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const changePassword = async (req: AuthenticatedRequest & { body: ChangePasswordInput }, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { oldPassword, newPassword } = req.body;
    await service.changePassword(userId, oldPassword, newPassword);
    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
