// src/types/auth.ts

export type UserRole = "admin" | "specialist" | "user";

export interface JwtPayload {
    userId: string;
    role: UserRole;
  }
  
  export interface RegisterInput {
    email: string;
    password: string;
    role?: UserRole;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface ChangePasswordInput {
    oldPassword: string;
    newPassword: string;
  }
  