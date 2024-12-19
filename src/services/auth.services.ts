import prisma from "../utils/prisma.utils"
import { comparePassword } from "../utils/password.utils";
import jwt from 'jsonwebtoken';

export const loginService = async (email: string, password: string) => {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            mahasiswa: true,
            dosen: true,
            pembimbingInstansi: true
        }
    });

    // Jika user tidak ditemukan
    if (!user) {
        throw new Error('Email atau password salah');
    }

    // Bandingkan password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Email atau password salah');
    }

    // Generate token JWT
    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
    );

    // Hapus password sebelum mengembalikan user
    const { password: _, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword
    };
};