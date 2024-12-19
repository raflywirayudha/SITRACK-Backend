import { Request, Response } from "express";
import { UserService } from "../services/koordinator.services";
import { GetUsersQuery } from "../types/user.types";
import { Role } from "@prisma/client";
import prisma from "../utils/prisma.utils"
import { hashPassword } from "../utils/password.utils";

const userService = new UserService();

export const addUser = async (req: Request, res: Response) => {
    try {
        const { nama, email, role, password } = req.body;

        // Validasi input
        if (!nama || !email || !role || !password) {
            return res.status(400).json({ message: "Semua field harus diisi" });
        }

        // Role bisa lebih dari satu
        const roles: Role[] = Array.isArray(role) ? role : [role];
        const hashedPassword = await hashPassword(password);

        // Buat user
        const newUser = await prisma.user.create({
            data: {
                nama,
                email,
                password: hashedPassword, // Simpan password plaintext, sebaiknya di-hash
                role: roles[0], // Role utama
            },
        });

        return res.status(201).json({ message: "User berhasil ditambahkan", user: newUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Parsing query parameters
        const query: GetUsersQuery = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
            role: req.query.role as Role | undefined,
            sortBy: req.query.sortBy as 'nama' | 'createdAt' | 'role' | undefined,
            sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined
        };

        // Validasi role jika disediakan
        if (query.role && !Object.values(Role).includes(query.role)) {
            return res.status(400).json({
                message: 'Invalid role provided'
            });
        }

        // Ambil users
        const result = await userService.getAllUsers(query);

        res.json({
            message: 'Users retrieved successfully',
            ...result
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({
            message: 'Error retrieving users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

// Tambah Jadwal Seminar
export const addJadwal = async (req, res) => {
    try {
        const { nim, dosenPengujiId, tanggal, ruangan } = req.body;

        // Validasi input
        if (!nim || !dosenPengujiId || !tanggal || !ruangan) {
            return res.status(400).json({ message: "Semua input wajib diisi!" });
        }

        // Cek apakah mahasiswa ada
        const mahasiswa = await prisma.mahasiswa.findUnique({
            where: { nim },
        });
        if (!mahasiswa) {
            return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
        }

        // Cek apakah dosen penguji ada
        const dosenPenguji = await prisma.dosen.findUnique({
            where: { id: dosenPengujiId },
        });
        if (!dosenPenguji) {
            return res.status(404).json({ message: "Dosen penguji tidak ditemukan" });
        }

        // Tambahkan jadwal
        const newJadwal = await prisma.nilai.create({
            data: {
                nim,
                dosenPengujiId,
                jadwal: new Date(tanggal),
                ruangan,
            },
        });

        return res.status(201).json({
            message: "Jadwal berhasil ditambahkan",
            data: newJadwal,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get Semua Jadwal Seminar
export const getJadwal = async (req, res) => {
    try {
        const jadwalList = await prisma.nilai.findMany({
            select: {
                id: true,
                jadwal: true,
                ruangan: true,
                mahasiswa: {
                    select: {
                        nim: true,
                        user: { select: { nama: true } },
                    },
                },
                dosenPenguji: {
                    select: { user: { select: { nama: true } } },
                },
            },
        });

        return res.status(200).json({
            message: "Daftar jadwal berhasil diambil",
            data: jadwalList,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};