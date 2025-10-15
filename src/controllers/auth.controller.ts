import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/user.model"; // Adjust path if needed
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { response400, response401 } from "../utils/response";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const hashPassword = (password: string, nim: string): string => {
  const md5 = crypto.createHash("md5").update(password).digest("hex");
  const sha1 = crypto
    .createHash("sha1")
    .update(md5 + nim)
    .digest("hex");
  return sha1;
};

class AuthController {
  // Login method
  async login(req: Request, res: Response) {
    const {
      nim,
      password,
    }: {
      nim: string;
      password: string;
    } = req.body;
    if (!nim || !password) {
      return response400(res, { message: "NIM dan password dibutuhkan" });
    }

    try {
      const user = await User.findByPk(nim);
      if (!user) {
        return response401(res, { message: "NIM atau password tidak valid" });
      }

      const hashed = hashPassword(password, nim.toUpperCase());

      console.log(hashed, user.password);
      if (user.password !== hashed) {
        return response401(res, { message: "credential tidak valid" });
      }

      // JWT Payload
      const payload = { nim: user.nim, role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });

      return res.json({
        status: true,
        message: "berhasil login",
        user: { nim: user.nim, name: user.name, role: user.role },
        token,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "server error" });
    }
  }

  // Register method
  async register(req: Request, res: Response) {
    const {
      nim,
      name,
      password,
      role,
    }: {
      nim: string;
      name: string;
      password: string;
      role?: "admin" | "KPRODI" | "Dosen" | "MHS";
    } = req.body;
    if (!nim || !name || !password) {
      return res
        .status(400)
        .json({ status: false, message: "NIM, name, and password dibutuhkan" });
    }

    try {
      const exists = await User.findByPk(nim);
      if (exists) {
        return res
          .status(409)
          .json({ status: false, message: "user sudah ada" });
      }

      const hashed = hashPassword(password, nim.toUpperCase());
      const user = await User.create({
        nim,
        name,
        password: hashed,
        role: role || "MHS",
      });

      return res.status(201).json({
        status: true,
        message: "berhasil register",
        user: { nim: user.nim, name: user.name, role: user.role },
      });
    } catch (err) {
      return res.status(500).json({ status: false, message: "server error" });
    }
  }
}

export default new AuthController();
