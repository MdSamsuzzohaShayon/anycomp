// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Use standard Request type for Express compatibility
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload; // optional here
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // Cast Request to AuthenticatedRequest
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
