import { Request, Response } from 'express';
import prisma from "../configs/prisma.configs"
import { add, format } from 'date-fns';
import * as jadwalSeminarService from "../services/jadwalSeminar.service";

export class SchedulerController {
    // Get Mahasiswa yang belum terjadwal seminar
    async getMahasiswa(req: Request, res: Response) {
        try {
            const mahasiswa = await prisma.mahasiswa.findMany({
                where: {
                    jadwalSeminar: {
                        none: {}
                    },
                    mahasiswaKp: {
                        isNot: null
                    }
                },
                select: {
                    id: true,
                    nim: true,
                    user: {
                        select: {
                            nama: true
                        }
                    },
                    mahasiswaKp: {
                        select: {
                            judulLaporan: true
                        }
                    }
                }
            });

            const formattedMahasiswa = mahasiswa.map(m => ({
                id: m.id,
                nim: m.nim,
                nama: m.user.nama,
                judul: m.mahasiswaKp?.judulLaporan || ''
            }));

            return res.json(formattedMahasiswa);
        } catch (error) {
            console.error('Error fetching mahasiswa:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get Dosen Penguji
    async getDosenPenguji(req: Request, res: Response) {
        try {
            const dosenPenguji = await prisma.dosen.findMany({
                where: {
                    isPenguji: true
                },
                select: {
                    id: true,
                    user: {
                        select: {
                            nama: true
                        }
                    }
                }
            });

            const formattedDosen = dosenPenguji.map(d => ({
                id: d.id,
                nama: d.user.nama
            }));

            return res.json(formattedDosen);
        } catch (error) {
            console.error('Error fetching dosen penguji:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Check Dosen Availability
    async checkDosenAvailability(req: Request, res: Response) {
        const { dosenId, tanggal, waktuMulai } = req.query;

        try {
            const startTime = new Date(`${tanggal}T${waktuMulai}`);
            const endTime = add(startTime, { hours: 1 });

            const existingJadwal = await prisma.jadwalSeminar.findFirst({
                where: {
                    dosenId: dosenId as string,
                    tanggal: new Date(tanggal as string),
                    OR: [
                        {
                            AND: [
                                { waktuMulai: { lte: startTime } },
                                { waktuSelesai: { gt: startTime } }
                            ]
                        },
                        {
                            AND: [
                                { waktuMulai: { lt: endTime } },
                                { waktuSelesai: { gte: endTime } }
                            ]
                        }
                    ]
                }
            });

            if (existingJadwal) {
                return res.json({
                    available: false,
                    message: 'Dosen sudah memiliki jadwal pada waktu tersebut'
                });
            }

            return res.json({
                available: true
            });
        } catch (error) {
            console.error('Error checking dosen availability:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Create Jadwal Seminar
    async createJadwal(req: Request, res: Response) {
        const { tanggal, waktuMulai, mahasiswaId, dosenPengujiId, ruangan } = req.body;

        try {
            // Check dosen availability first
            const startTime = new Date(`${tanggal}T${waktuMulai}`);
            const endTime = add(startTime, { hours: 1 });

            const existingJadwal = await prisma.jadwalSeminar.findFirst({
                where: {
                    dosenId: dosenPengujiId,
                    tanggal: new Date(tanggal),
                    OR: [
                        {
                            AND: [
                                { waktuMulai: { lte: startTime } },
                                { waktuSelesai: { gt: startTime } }
                            ]
                        },
                        {
                            AND: [
                                { waktuMulai: { lt: endTime } },
                                { waktuSelesai: { gte: endTime } }
                            ]
                        }
                    ]
                }
            });

            if (existingJadwal) {
                return res.status(400).json({
                    error: 'Dosen sudah memiliki jadwal pada waktu tersebut'
                });
            }

            // Create new jadwal
            const jadwal = await prisma.jadwalSeminar.create({
                data: {
                    tanggal: new Date(tanggal),
                    waktuMulai: startTime,
                    waktuSelesai: endTime,
                    ruangan,
                    mahasiswa: {
                        connect: { id: mahasiswaId }
                    },
                    dosen: {
                        connect: { id: dosenPengujiId }
                    },
                    status: 'scheduled'
                }
            });

            return res.json(jadwal);
        } catch (error) {
            console.error('Error creating jadwal:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
export const getAllJadwal = async (_req: Request, res: Response) => {
    try {
        const jadwal = await jadwalSeminarService.getAllJadwal();
        return res.status(200).json(jadwal);
    } catch (error) {
        return res.status(500).json({ message: "Gagal mengambil data jadwal", error });
    }
};