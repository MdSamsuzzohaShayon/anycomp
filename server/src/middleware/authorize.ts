import { Request, Response, NextFunction } from "express";
import { JwtPayload, UserRole } from "../types/auth";
import { AuthenticatedRequest } from "./auth";

export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Assuming user role is attached to req.user after authentication
    const user = (req as AuthenticatedRequest).user as JwtPayload;
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    next();
  };
};