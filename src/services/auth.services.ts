import prisma from '../configs/prisma.configs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginDTO } from '../types/auth.types';
import {RoleType} from "@prisma/client";

export class AuthService {
    async register(input: RegisterInput) {
        const hashedPassword = await bcrypt.hash(input.password, 10);

        return prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: input.email,
                    nama: input.nama,
                    password: hashedPassword,
                },
            });

            const mahasiswaRole = await tx.role.findUnique({
                where: { name: 'mahasiswa' },
            });

            if (!mahasiswaRole) {
                throw new Error('Mahasiswa role not found');
            }

            await tx.userRole.create({
                data: {
                    userId: user.id,
                    roleId: mahasiswaRole.id,
                },
            });

            await tx.mahasiswa.findUnique({
                where: { nim: input.nim },
            }).then(existingMahasiswa => {
                if (existingMahasiswa) {
                    throw new Error('NIM already exists');
                }
            });

            await tx.mahasiswa.create({
                data: {
                    userId: user.id,
                    nim: input.nim,
                },
            });

            return user;
        });
    }

    checkEmailExists(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }


    async login(loginDto: LoginDTO) {
        const user = await prisma.user.findUnique({
            where: { email: loginDto.email },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const roles = user.userRoles.map(ur => ur.role.name);
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                roles
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                nama: user.nama,
                roles
            }
        };
    }

    async validateRole(userId: string, requiredRoles: RoleType[]): Promise<boolean> {
        const userRoles = await prisma.userRole.findMany({
            where: { userId },
            include: { role: true }
        });

        return userRoles.some(ur => requiredRoles.includes(ur.role.name));
    }

    static async checkEmailExists(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return !!user;
    }

    static async resetPassword(email: string, newPassword: string): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        try {
            const updatedUser = await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            });

            return !!updatedUser;
        } catch (error) {
            console.error('Error resetting password:', error);
            return false;
        }
    }
}