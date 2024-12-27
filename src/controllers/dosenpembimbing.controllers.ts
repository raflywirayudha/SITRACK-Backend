import {Request, Response} from "express";
import prisma from "../configs/prisma.configs";
import { Student } from "../types/mahasiswa.types"

export class DosenPembimbingController {
    // Get all students under supervision
    async getMahasiswaBimbingan(req: Request, res: Response) {
        try {
            const { dosenId } = req.params;

            const mahasiswa = await prisma.mahasiswaKp.findMany({
                where: {
                    dosenPembimbingId: dosenId
                },
                include: {
                    mahasiswa: {
                        include: {
                            user: true,
                            jadwalSeminar: {
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 1,
                                include: {
                                    nilai: true
                                }
                            }
                        }
                    },
                }
            });

            const formattedMahasiswa: Student[] = mahasiswa.map(mhs => {
                const latestSeminar = mhs.mahasiswa?.jadwalSeminar[0];
                let status: Student['status'] = "Menunggu Seminar";
                let action: Student['action'] = "Input Nilai";

                if (latestSeminar) {
                    if (latestSeminar.status === "completed") {
                        status = "Selesai Seminar";
                        action = "Lihat Nilai";
                    } else if (latestSeminar.status === "scheduled") {
                        status = "Sedang Berlangsung";
                    }
                }

                return {
                    name: mhs.mahasiswa?.user.nama || '',
                    nim: mhs.nim || '',
                    department: 'Teknik Informatika', // Assuming fixed department
                    status,
                    company: mhs.namaInstansi || '',
                    pembimbing: mhs.namaPembimbingInstansi || '',
                    judulKP: mhs.judulLaporan || '',
                    action
                };
            });

            res.json(formattedMahasiswa);
        } catch (error) {
            console.error('Error fetching mahasiswa bimbingan:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Input nilai for a student
    async inputNilai(req: Request, res: Response) {
        try {
            const { mahasiswaNim, nilai } = req.body;
            const { dosenId } = req.params;

            // Find the latest seminar schedule
            const jadwalSeminar = await prisma.jadwalSeminar.findFirst({
                where: {
                    nim: mahasiswaNim,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!jadwalSeminar) {
                return res.status(404).json({ error: 'Jadwal seminar not found' });
            }

            // Update or create nilai
            const updatedNilai = await prisma.nilai.upsert({
                where: {
                    jadwalSeminarId: jadwalSeminar.id,
                },
                update: {
                    nilaiPembimbing: nilai,
                    dosenPembimbingId: dosenId,
                },
                create: {
                    jadwalSeminarId: jadwalSeminar.id,
                    nilaiPembimbing: nilai,
                    dosenPembimbingId: dosenId,
                    nim: mahasiswaNim,
                },
            });

            res.json(updatedNilai);
        } catch (error) {
            console.error('Error inputting nilai:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get nilai for a specific student
    async getNilai(req: Request, res: Response) {
        try {
            const { mahasiswaNim } = req.params;

            const nilai = await prisma.nilai.findFirst({
                where: {
                    nim: mahasiswaNim,
                },
                include: {
                    jadwalSeminar: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!nilai) {
                return res.status(404).json({ error: 'Nilai not found' });
            }

            res.json(nilai);
        } catch (error) {
            console.error('Error fetching nilai:', error);
            res.status(500).json({ error: 'Internal server error' });
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