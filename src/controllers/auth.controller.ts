import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const postAkun = async (req: Request, res: Response) => {
  const { email, nama, password, role } = req.body;

  try {
    // Mengecek apakah email sudah terdaftar
    const checkUser = await prisma.user.findFirst({
      where: { email }
    });

    if (checkUser) {
      return res.status(400).json({
        response: false,
        message: "Akun dengan email tersebut sudah ada!"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat akun baru
    const result = await prisma.user.create({
      data: {
        email,
        nama,
        password: hashedPassword,
        role: role || Role.mahasiswa
      }
    });

    res.status(201).json({
      response: true,
      message: "Akun Berhasil didaftarkan!",
      data: {
        id: result.id,
        email: result.email,
        nama: result.nama,
        role: result.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response: false,
      message: "Oops! Ada kesalahan di server kami"
    });
  }
};

export { postAkun };