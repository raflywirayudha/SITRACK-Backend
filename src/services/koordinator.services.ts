import { Role, User } from '@prisma/client';
import prisma from "../utils/prisma.utils"
import { CreateUserDTO, UpdateUserDTO, GetUsersQuery, UserProfileDTO } from "../types/user.types"
import { hashPassword, generateDefaultPassword } from "../utils/password.utils"

export class UserService {
    async createUser(userData: CreateUserDTO): Promise<User> {
        const { nama, email, roles } = userData;

        // Generate default password if not provided
        const defaultPassword = userData.password || generateDefaultPassword();
        const hashedPassword = await hashPassword(defaultPassword);

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                nama,
                email,
                password: hashedPassword,
                role: roles[0],
            }
        });

        // If multiple roles, update them separately
        if (roles.length > 1) {
            // Additional role-specific logic can be added here
            // For example, creating corresponding entries in Dosen, Mahasiswa, etc.
            await this.assignAdditionalRoles(user.id, roles.slice(1));
        }

        return user;
    }

    private async assignAdditionalRoles(userId: string, additionalRoles: Role[]) {
        // This method would handle creating additional role-specific entries
        // Depending on the role, you might create entries in different tables
        for (const role of additionalRoles) {
            switch (role) {
                case 'dosen_pembimbing':
                    await prisma.dosen.create({
                        data: {
                            userId,
                            isPembimbing: true,
                            nip: `NIP_${userId.slice(0,8)}` // Example NIP generation
                        }
                    });
                    break;
                case 'dosen_penguji':
                    await prisma.dosen.create({
                        data: {
                            userId,
                            isPenguji: true,
                            nip: `NIP_${userId.slice(0,8)}`
                        }
                    });
                    break;
                // Add more role-specific logic as needed
            }
        }
    }

    async getUserById(userId: string): Promise<Partial<User> | null> {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nama: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
    }

    async getAllUsers({
                          page = 1,
                          pageSize = 10,
                          role,
                          sortBy = 'createdAt',
                          sortOrder = 'desc'
                      }: GetUsersQuery = {}): Promise<{
        users: UserProfileDTO[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        // Validasi input
        const skip = (page - 1) * pageSize;

        // Bangun kondisi filter
        const whereCondition: any = {};
        if (role) {
            whereCondition.role = role;
        }

        // Bangun konfigurasi sorting
        const orderBy: any = {};
        orderBy[sortBy] = sortOrder;

        // Ambil users
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    nama: true,
                    email: true,
                    role: true,
                    photoPath: true,
                    createdAt: true
                },
                orderBy,
                skip,
                take: pageSize
            }),
            prisma.user.count({ where: whereCondition })
        ]);

        return {
            users: users as UserProfileDTO[],
            total,
            page,
            pageSize
        };
    }

    async updateUser(userId: string, userData: UpdateUserDTO): Promise<User> {
        return prisma.user.update({
            where: { id: userId },
            data: userData
        });
    }

    async deleteUser(userId: string): Promise<void> {
        await prisma.user.delete({
            where: { id: userId }
        });
    }
}