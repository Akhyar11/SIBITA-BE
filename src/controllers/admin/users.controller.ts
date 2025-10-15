import { Request, Response } from "express";
import { Op } from "sequelize";
import User from "../../models/user.model";
import {
  response200,
  response400,
  response404,
  response500,
} from "../../utils/response";
import { MetadataRequestParams } from "../../types";

interface UserRequestParams extends MetadataRequestParams {
  nim?: string;
  name?: string;
  role?: string;
}

class UsersController {
  // ===========================
  // CREATE USER
  // ===========================
  async create(req: Request, res: Response) {
    try {
      const { nim, name, role, password } = req.body;

      if (!nim || !name || !password)
        return response400(res, { message: "Data tidak lengkap" });

      const exists = await User.findOne({ where: { nim } });
      if (exists) return response400(res, { message: "NIM sudah terdaftar" });

      const newUser = await User.create({ nim, name, role, password });
      return response200(res, {
        message: "User berhasil dibuat",
        data: newUser,
      });
    } catch (error) {
      console.error("Create User Error:", error);
      return response500(res, { message: "Server error" });
    }
  }

  // ===========================
  // READ USERS (LIST + FILTER)
  // ===========================
  async read(req: Request, res: Response) {
    try {
      const {
        page = 0,
        limit = 10,
        nim,
        name,
        role,
      }: UserRequestParams = req.body;

      const where: any = {};
      if (nim) where.nim = nim;
      if (name) where.name = { [Op.like]: `%${name}%` };
      if (role) where.role = role;

      // total keseluruhan data tanpa filter
      const totalAllData = await User.count();

      // total data setelah filter diterapkan
      const totalFilterData = await User.count({ where });

      const users = await User.findAll({
        where,
        offset: page * limit,
        limit,
        order: [["nim", "DESC"]],
      });

      const data = users.map((user, i) => ({
        no: page * limit + i + 1,
        ...user.get({ plain: true }),
      }));

      return response200(res, {
        message: "Berhasil membaca daftar users",
        page: Number(page),
        limit: Number(limit),
        totalFilterData,
        totalAllData,
        data,
      });
    } catch (error) {
      console.error("Read Users Error:", error);
      return response500(res, { message: "Server error" });
    }
  }

  // ===========================
  // READ DETAIL USER BY ID
  // ===========================
  async detail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) return response404(res, { message: "User tidak ditemukan" });

      return response200(res, { message: "Berhasil membaca user", data: user });
    } catch (error) {
      console.error("Detail User Error:", error);
      return response500(res, { message: "Server error" });
    }
  }

  // ===========================
  // UPDATE USER
  // ===========================
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, role, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) return response404(res, { message: "User tidak ditemukan" });

      await user.update({ name, role, password });

      return response200(res, {
        message: "User berhasil diperbarui",
        data: user,
      });
    } catch (error) {
      console.error("Update User Error:", error);
      return response500(res, { message: "Server error" });
    }
  }

  // ===========================
  // DELETE USER
  // ===========================
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) return response404(res, { message: "User tidak ditemukan" });

      await user.destroy();

      return response200(res, { message: "User berhasil dihapus" });
    } catch (error) {
      console.error("Delete User Error:", error);
      return response500(res, { message: "Server error" });
    }
  }
}

export default new UsersController();
