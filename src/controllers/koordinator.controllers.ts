import { Request, Response } from 'express';
import { KoordinatorServices } from '../services/koordinator.services';
import { RegisterSchema, UserResponse, GetUsersQuery } from '../types/user.types';
import { StudentResponse } from "../types/mahasiswa.types"
import { ZodError } from 'zod';
import prisma from "../configs/prisma.configs";

const koordinotorService = new KoordinatorServices();

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

    async getAllStudentsWithFiles(req: Request, res: Response) {
        try {
            const students = await prisma.mahasiswa.findMany({
                select: {
                    id: true,
                    nim: true,
                    noHp: true,
                    semester: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            nama: true,
                            photoPath: true,
                        },
                    },
                    dokumen: {
                        select: {
                            id: true,
                            jenisDokumen: true,
                            kategori: true,
                            filePath: true,
                            tanggalUpload: true,
                            status: true,
                        },
                    },
                },
            });

            if (!students.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No students found',
                    data: [],
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Students retrieved successfully',
                data: students,
            });
        } catch (error) {
            console.error('Error fetching students:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    }

    async getDokumen(req: Request, res: Response) {
        try {
            const { nim } = req.params;
            const dokumen = await koordinotorService.getDokumenByNim(nim);
            res.json(dokumen);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status, komentar } = req.body;
            const koordinatorId = req.user.id; // Assuming user data from middleware

            const updatedDokumen = await koordinotorService.updateDokumenStatus(
                id,
                status,
                koordinatorId,
                komentar
            );

            res.json(updatedDokumen);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDokumenByNim(req: Request, res: Response) {
        try {
            const { nim } = req.params;
            const documents = await prisma.dokumen.findMany({
                where: { nim },
                include: {
                    reviews: {
                        orderBy: { tanggalReview: 'desc' },
                        take: 1
                    }
                },
                orderBy: { tanggalUpload: 'desc' }
            });

            const groupedDocuments = {
                PERSYARATAN: documents.filter(doc => doc.kategori === 'PERSYARATAN'),
                PENDAFTARAN: documents.filter(doc => doc.kategori === 'PENDAFTARAN'),
                PASCA_SEMINAR: documents.filter(doc => doc.kategori === 'PASCA_SEMINAR')
            };

            res.json(groupedDocuments);
        } catch (error) {
            res.status(500).json({ error: error.message });
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

