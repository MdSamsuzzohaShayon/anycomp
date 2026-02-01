// src/types/auth.ts
export interface JwtPayload {
    userId: string;
    role: "admin" | "specialist" | "user";
  }
  
  export interface RegisterInput {
    email: string;
    password: string;
    role?: "admin" | "specialist" | "user";
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface ChangePasswordInput {
    oldPassword: string;
    newPassword: string;
  }
  