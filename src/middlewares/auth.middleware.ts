import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { response401 } from "../utils/response";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ============================
// Define user payload structure
// ============================
export interface DecodedToken extends JwtPayload {
  nim: string;
  name: string;
  role: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

// ============================
// AUTH MIDDLEWARE
// ============================
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Allow unauthenticated access for login or register
    if (req.path.includes("/login") || req.path.includes("/register")) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response401(res, { message: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    req.user = decoded; // simpan payload JWT ke req.user
    next();
  } catch (error: any) {
    console.error("Auth Middleware Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return response401(res, { message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return response401(res, { message: "Invalid token" });
    }
    return response401(res, { message: "Unauthorized" });
  }
}

// ============================
// ADMIN ROLE MIDDLEWARE
// ============================
export function adminRoleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.path.includes("/login")) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response401(res, { message: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (decoded.role !== "admin") {
      return response401(res, { message: "Forbidden: Admin role required" });
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("Admin Middleware Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return response401(res, { message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return response401(res, { message: "Invalid token" });
    }
    return response401(res, { message: "Unauthorized" });
  }
}
