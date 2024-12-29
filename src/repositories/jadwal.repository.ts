import prisma from '../configs/prisma.configs';
import { CreateJadwalDTO, MahasiswaResponse, DosenResponse } from '../types/jadwal.types';

export class JadwalRepository {
    async getMahasiswa(): Promise<MahasiswaResponse[]> {
        const mahasiswaList = await prisma.mahasiswa.findMany({
            select: {
                id: true,
                nim: true,
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
            where: {
                mahasiswaKp: {
                    isNot: null,
                },
            },
        });

        return mahasiswaList.map(m => ({
            id: m.id,
            nama: m.user.nama,
            nim: m.nim,
            judul: m.mahasiswaKp?.judulLaporan || '',
        }));
    }

    async getDosenPenguji(): Promise<DosenResponse[]> {
        const dosenList = await prisma.dosen.findMany({
            where: {
                isPenguji: true,
            },
            select: {
                id: true,
                user: {
                    select: {
                        nama: true,
                    },
                },
            },
        });

        return dosenList.map(d => ({
            id: d.id,
            nama: d.user.nama,
        }));
    }

    async checkDosenAvailability(dosenId: string, tanggal: string, waktuMulai: string): Promise<boolean> {
        const existingJadwal = await prisma.jadwalSeminar.findFirst({
            where: {
                dosenId,
                tanggal: new Date(tanggal),
                waktuMulai: new Date(`${tanggal}T${waktuMulai}`),
            },
        });

        return !existingJadwal;
    }

    async createJadwal(data: CreateJadwalDTO) {
        const mahasiswa = await prisma.mahasiswa.findUnique({
            where: { id: data.mahasiswaId },
            select: { nim: true },
        });

        if (!mahasiswa) {
            throw new Error('Mahasiswa not found');
        }

        const waktuMulai = new Date(`${data.tanggal}T${data.waktuMulai}`);
        const waktuSelesai = new Date(waktuMulai.getTime() + 60 * 60 * 1000); // 1 hour duration

        return prisma.jadwalSeminar.create({
            data: {
                nim: mahasiswa.nim,
                tanggal: new Date(data.tanggal),
                waktuMulai,
                waktuSelesai,
                ruangan: data.ruangan,
                dosenId: data.dosenPengujiId,
                status: 'scheduled',
            },
            include: {
                mahasiswa: {
                    include: {
                        user: true,
                    },
                },
                dosen: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
}
