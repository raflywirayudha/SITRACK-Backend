import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';

export class PembimbingInstansiService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getProfile(userId: string) {
        const profile = await this.prisma.pembimbingInstansi.findFirst({
            where: { userId },
            include: {
                user: {
                    select: {
                        nama: true,
                        email: true,
                        userRoles: {
                            include: {
                                role: true
                            }
                        }
                    }
                }
            }
        });

        if (!profile) {
            throw new ApiError('Profile not found', 404);
        }

        return profile;
    }

    async getStudents(pembimbingId: string) {
        const students = await this.prisma.mahasiswaKp.findMany({
            where: {
                pembimbingInstansiId: pembimbingId
            },
            include: {
                mahasiswa: {
                    include: {
                        user: {
                            select: {
                                nama: true,
                                email: true
                            }
                        },
                        jadwalSeminar: {
                            where: {
                                status: 'completed'
                            },
                            take: 1,
                            orderBy: {
                                tanggal: 'desc'
                            }
                        }
                    }
                }
            }
        });

        return students.map(student => ({
            nim: student.nim,
            name: student.mahasiswa?.user.nama,
            startDate: student.mulaiKp,
            endDate: student.selesaiKp,
            projectTitle: student.judulLaporan,
            seminarDate: student.mahasiswa?.jadwalSeminar[0]?.tanggal,
            status: student.selesaiKp && new Date() > new Date(student.selesaiKp) ? 'Selesai' : 'Aktif'
        }));
    }

    async getNilaiMahasiswa(pembimbingId: string, nim: string) {
        const nilai = await this.prisma.nilai.findFirst({
            where: {
                nim,
                pembimbingInstansiId: pembimbingId
            },
            include: {
                mahasiswa: {
                    include: {
                        user: {
                            select: {
                                nama: true
                            }
                        }
                    }
                },
                jadwalSeminar: true
            }
        });

        if (!nilai) {
            throw new ApiError('Nilai not found', 404);
        }

        return nilai;
    }

    async inputNilai(pembimbingId: string, nim: string, nilaiInput: number) {
        // Validate if the student belongs to this supervisor
        const mahasiswaKp = await this.prisma.mahasiswaKp.findFirst({
            where: {
                nim,
                pembimbingInstansiId: pembimbingId
            }
        });

        if (!mahasiswaKp) {
            throw new ApiError('Student not found or not assigned to this supervisor', 404);
        }

        // Get the latest seminar schedule
        const jadwalSeminar = await this.prisma.jadwalSeminar.findFirst({
            where: {
                nim,
                status: 'completed'
            },
            orderBy: {
                tanggal: 'desc'
            }
        });

        if (!jadwalSeminar) {
            throw new ApiError('No completed seminar found for this student', 404);
        }

        // Update or create nilai
        const nilai = await this.prisma.nilai.upsert({
            where: {
                jadwalSeminarId: jadwalSeminar.id
            },
            update: {
                nilaiPembimbingInstansi: nilaiInput,
                pembimbingInstansiId: pembimbingId
            },
            create: {
                jadwalSeminarId: jadwalSeminar.id,
                nilaiPembimbingInstansi: nilaiInput,
                pembimbingInstansiId: pembimbingId,
                nim
            }
        });

        return nilai;
    }
}