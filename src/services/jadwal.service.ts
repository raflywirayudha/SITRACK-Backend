import prisma from "../configs/prisma.configs"
import { JadwalRepository } from '../repositories/jadwal.repository';
import { CreateJadwalDTO, MahasiswaResponse, DosenResponse } from '../types/jadwal.types';

export class JadwalService {
    private repository: JadwalRepository;

    constructor() {
        this.repository = new JadwalRepository();
    }

    async getMahasiswa(): Promise<MahasiswaResponse[]> {
        return this.repository.getMahasiswa();
    }

    async getDosenPenguji(): Promise<DosenResponse[]> {
        return this.repository.getDosenPenguji();
    }

    async checkDosenAvailability(dosenId: string, tanggal: string, waktuMulai: string): Promise<{
        available: boolean;
        message?: string;
    }> {
        const isAvailable = await this.repository.checkDosenAvailability(dosenId, tanggal, waktuMulai);

        return {
            available: isAvailable,
            message: isAvailable ? undefined : 'Dosen sudah memiliki jadwal di waktu tersebut',
        };
    }

    async createJadwal(data: CreateJadwalDTO) {
        const isDosenAvailable = await this.repository.checkDosenAvailability(
            data.dosenPengujiId,
            data.tanggal,
            data.waktuMulai
        );

        if (!isDosenAvailable) {
            throw new Error('Dosen tidak tersedia pada waktu yang dipilih');
        }

        return this.repository.createJadwal(data);
    }

    async getAllSchedules() {
        return await prisma.jadwalSeminar.findMany({
            include: {
                mahasiswa: {
                    include: {
                        user: {
                            select: {
                                nama: true,
                            },
                        },
                        mahasiswaKp: {
                            select: {
                                judulLaporan: true,
                            },
                        },
                    },
                },
                dosen: {
                    include: {
                        user: {
                            select: {
                                nama: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
