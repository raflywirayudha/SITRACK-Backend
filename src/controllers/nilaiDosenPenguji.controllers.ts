import { Request, Response } from 'express';
import prisma from "../configs/prisma.configs"
import { InputNilaiPengujiDTO } from "../types/nilai.types"

export class NilaiController {
    async getNilaiPengujiAssignments(req: Request, res: Response) {
        try {
            const dosenId = req.dosenId;

            const jadwalSeminars = await prisma.jadwalSeminar.findMany({
                where: {
                    dosenId: dosenId,
                    status: 'scheduled',
                },
                include: {
                    mahasiswa: {
                        include: {
                            user: true
                        }
                    },
                    nilai: true
                }
            });

            return res.status(200).json({
                status: 'success',
                data: jadwalSeminars
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async inputNilaiPenguji(req: Request, res: Response) {
        try {
            const dosenId = req.dosenId;
            const { jadwalSeminarId, nilaiPenguji }: InputNilaiPengujiDTO = req.body;

            // Validate input
            if (!jadwalSeminarId || typeof nilaiPenguji !== 'number' || nilaiPenguji < 0 || nilaiPenguji > 100) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid input: Nilai must be between 0 and 100'
                });
            }

            // Check if jadwal seminar exists and dosen is assigned as penguji
            const jadwalSeminar = await prisma.jadwalSeminar.findFirst({
                where: {
                    id: jadwalSeminarId,
                    dosenId: dosenId,
                    status: 'scheduled'
                },
                include: {
                    nilai: true
                }
            });

            if (!jadwalSeminar) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Jadwal seminar not found or you are not assigned as penguji'
                });
            }

            // Update or create nilai
            const nilai = await prisma.nilai.upsert({
                where: {
                    jadwalSeminarId: jadwalSeminarId
                },
                update: {
                    nilaiPenguji: nilaiPenguji,
                    dosenPengujiId: dosenId,
                    updatedAt: new Date()
                },
                create: {
                    jadwalSeminarId: jadwalSeminarId,
                    nilaiPenguji: nilaiPenguji,
                    dosenPengujiId: dosenId,
                    nim: jadwalSeminar.nim
                }
            });

            return res.status(200).json({
                status: 'success',
                message: 'Nilai penguji has been submitted successfully',
                data: nilai
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}


export const getNilaiByNim = async (req: Request, res: Response) => {
    try {
        const { nim } = req.params;
        const dosenId = req.user?.dosen?.id;

        if (!dosenId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Dosen ID not found',
            });
        }

        const nilai = await prisma.nilai.findFirst({
            where: {
                nim: nim,
                dosenPengujiId: dosenId,
            },
            include: {
                mahasiswa: {
                    include: {
                        user: true,
                    },
                },
                jadwalSeminar: true,
            },
        });

        if (!nilai) {
            return res.status(404).json({
                success: false,
                message: 'Nilai not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: nilai,
        });

    } catch (error) {
        console.error('Error in getNilaiByNim:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};