import { Request, Response } from 'express';
import { KoordinatorServices } from '../services/koordinator.services';
import { RegisterSchema, UserResponse, GetUsersQuery } from '../types/user.types';
import { ZodError } from 'zod';
import prisma from "../configs/prisma.configs";

export class KoordinatorController {
    private koordinatorServices: KoordinatorServices;

    constructor() {
        this.koordinatorServices = new KoordinatorServices();
    }

    register = async (req: Request, res: Response) => {
        try {
            // Validate input
            const validatedInput = RegisterSchema.parse(req.body);

            // Process registration
            const result = await this.koordinatorServices.register(validatedInput);

            return res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    id: result.id,
                    email: result.email,
                    nama: result.nama,
                }
            });

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }

            if (error instanceof Error) {
                // Handle known error types
                if (error.message.includes('already exists')) {
                    return res.status(409).json({
                        success: false,
                        message: error.message
                    });
                }

                if (error.message.includes('not found')) {
                    return res.status(404).json({
                        success: false,
                        message: error.message
                    });
                }

                if (error.message.includes('required')) {
                    return res.status(400).json({
                        success: false,
                        message: error.message
                    });
                }
            }

            // Default error response
            console.error('Registration error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };

    async getUsers(req: Request<{}, {}, {}, GetUsersQuery>, res: Response) {
        try {
            const {
                page = 1,
                pageSize = 10,
                role,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                search,
            } = req.query;

            const pageInt = parseInt(page as string, 10);
            const pageSizeInt = parseInt(pageSize as string, 10);

            // Calculate pagination
            const skip = (pageInt - 1) * pageSizeInt;

            // Build where clause
            const where: any = {};

            // Handle role filtering
            if (role && role !== 'all') {
                where.userRoles = {
                    some: {
                        role: {
                            name: role
                        }
                    }
                };
            }

            // Handle search
            if (search) {
                where.OR = [
                    { nama: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { mahasiswa: { nim: { contains: search, mode: 'insensitive' } } },
                    { dosen: { nip: { contains: search, mode: 'insensitive' } } }
                ];
            }

            // Get total count
            const total = await prisma.user.count({ where });

            // Get users with relations
            const users = await prisma.user.findMany({
                where,
                skip,
                take: pageSizeInt,
                include: {
                    userRoles: {
                        include: {
                            role: true
                        }
                    },
                    mahasiswa: true,
                    dosen: true
                },
                orderBy: {
                    [sortBy]: sortOrder
                }
            });

            // Transform data for response
            const transformedUsers: UserResponse[] = users.map(user => ({
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.userRoles[0]?.role.name || 'unknown',
                photoPath: user.photoPath || undefined,
                nim: user.mahasiswa?.nim,
                nip: user.dosen?.nip,
                createdAt: user.createdAt.toISOString()
            }));

            return res.json({
                users: transformedUsers,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSizeInt)
            });

        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to fetch users'
            });
        }
    }
}

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user.userId;
        console.log('userId from token:', userId); // Debug userId

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nama: true,
                email: true,
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        console.log('found user:', user); // Debug user result

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        const err = error as Error; // Type assertion
        console.error('Error in getCurrentUser:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};