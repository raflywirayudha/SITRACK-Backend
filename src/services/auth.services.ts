import prisma from '../configs/prisma.configs';
import bcrypt from 'bcrypt';
import { RegisterInput } from '../types/auth.types';

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
}