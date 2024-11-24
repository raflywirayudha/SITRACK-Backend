import { PrismaClient, Role,User } from '@prisma/client';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginDTO, RegisterDTO, JWTPayload } from '../types/auth.types'

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
    static async register(data: RegisterDTO): Promise<{ user: User; token: string }> {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.$transaction(async (tx) => {
            // Create base user
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    role: data.role,
                },
            });

            // Create role-specific profile
            switch (data.role) {
                case 'mahasiswa':
                    if (!data.nim) throw new Error('NIM required for mahasiswa');
                    await tx.mahasiswa.create({
                        data: {
                            nim: data.nim,
                            nama: data.nama,
                            noHp: data.noHp,
                            semester: data.semester,
                            userId: user.id,
                        },
                    });
                    break;

                case 'dosen':
                    if (!data.nip) throw new Error('NIP required for dosen');
                    await tx.dosen.create({
                        data: {
                            nip: data.nip,
                            nama: data.nama,
                            userId: user.id,
                        },
                    });
                    break;

                case 'pembimbing_instansi':
                    await tx.pembimbingInstansi.create({
                        data: {
                            nama: data.nama,
                            instansi: data.instansi!,
                            jabatan: data.jabatan,
                            noTelpon: data.noTelpon,
                            userId: user.id,
                        },
                    });
                    break;
            }

            return user;
        });

        const token = this.generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return { user, token };
    }

    static async login(data: LoginDTO): Promise<{ user: User; token: string }> {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = this.generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return { user, token };
    }

    private static generateToken(payload: JWTPayload): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    }
}