import {Request, Response} from "express";
import prisma from "../configs/prisma.configs";
import { CreateNilaiDTO, UpdateNilaiDTO } from '../types/seminar.types';
import { StatusSeminar } from '@prisma/client';
import { DosenPengujiServices } from "../services/dosenPenguji.services"

export class DosenPengujiController {
    private dosenPengujiServices: DosenPengujiServices;

    constructor() {
        this.dosenPengujiServices = new DosenPengujiServices();
    }

    getStudentsByExaminer = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dosenId } = req.params;

            if (!dosenId) {
                res.status(400).json({ error: 'Dosen ID is required' });
                return;
            }

            const students = await this.dosenPengujiServices.getStudentsByExaminer(dosenId);
            res.status(200).json({
                success: true,
                data: students,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    // Get seminar by ID
    async getSeminarById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const seminar = await prisma.jadwalSeminar.findUnique({
                where: { id },
                include: {
                    mahasiswa: {
                        include: {
                            user: true,
                            mahasiswaKp: {
                                include: {
                                    dosenPembimbing: {
                                        include: {
                                            user: true
                                        }
                                    },
                                    pembimbingInstansi: {
                                        include: {
                                            user: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    nilai: true
                }
            });

            if (!seminar) {
                return res.status(404).json({
                    success: false,
                    message: 'Seminar tidak ditemukan'
                });
            }

            return res.status(200).json({
                success: true,
                data: seminar
            });
        } catch (error) {
            console.error('Error fetching seminar:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data seminar'
            });
        }
    }

    // Submit or update grades
    async submitNilai(req: Request, res: Response) {
        const nilaiData: CreateNilaiDTO = req.body;

        try {
            // Check if nilai already exists
            const existingNilai = await prisma.nilai.findUnique({
                where: { jadwalSeminarId: nilaiData.jadwalSeminarId }
            });

            let nilai;
            if (existingNilai) {
                // Update existing nilai
                nilai = await prisma.nilai.update({
                    where: { jadwalSeminarId: nilaiData.jadwalSeminarId },
                    data: {
                        nilaiPenguji: nilaiData.nilaiPenguji,
                        dosenPengujiId: nilaiData.dosenPengujiId,
                        updatedAt: new Date()
                    }
                });
            } else {
                // Create new nilai
                nilai = await prisma.nilai.create({
                    data: {
                        jadwalSeminarId: nilaiData.jadwalSeminarId,
                        nilaiPenguji: nilaiData.nilaiPenguji,
                        dosenPengujiId: nilaiData.dosenPengujiId,
                        nim: nilaiData.nim
                    }
                });

                // Update seminar status to completed
                await prisma.jadwalSeminar.update({
                    where: { id: nilaiData.jadwalSeminarId },
                    data: { status: 'completed' as StatusSeminar }
                });
            }

            return res.status(200).json({
                success: true,
                data: nilai,
                message: 'Nilai berhasil disimpan'
            });
        } catch (error) {
            console.error('Error submitting nilai:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal menyimpan nilai'
            });
        }
    }

    // Get grades by seminar ID
    async getNilaiByJadwalId(req: Request, res: Response) {
        const { jadwalSeminarId } = req.params;

        try {
            const nilai = await prisma.nilai.findUnique({
                where: { jadwalSeminarId },
                include: {
                    dosenPembimbing: {
                        include: {
                            user: true
                        }
                    },
                    dosenPenguji: {
                        include: {
                            user: true
                        }
                    },
                    pembimbingInstansi: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            if (!nilai) {
                return res.status(404).json({
                    success: false,
                    message: 'Nilai tidak ditemukan'
                });
            }

            return res.status(200).json({
                success: true,
                data: nilai
            });
        } catch (error) {
            console.error('Error fetching nilai:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data nilai'
            });
        }
    }
}

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user.userId;
        console.log('userId from token:', userId);

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
                },
                mahasiswa: {
                    select: {
                        nim: true
                    }
                },
                dosen: {
                    select: {
                        id: true,
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
