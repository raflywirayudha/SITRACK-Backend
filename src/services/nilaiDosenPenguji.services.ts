import prisma from "../configs/prisma.configs"
import {CreateNilaiDTO,UpdateNilaiDTO} from "../types/nilai.types"

export class NilaiService {
    async createNilai(data: CreateNilaiDTO) {
        const mahasiswa = await prisma.mahasiswa.findUnique({
            where: { nim: data.nim }
        });

        if (!mahasiswa) {
            throw new Error('Mahasiswa tidak ditemukan');
        }

        const jadwalSeminar = await prisma.jadwalSeminar.findUnique({
            where: { id: data.jadwalSeminarId }
        });

        if (!jadwalSeminar) {
            throw new Error('Jadwal seminar tidak ditemukan');
        }

        return prisma.nilai.create({
            data: {
                jadwalSeminar: { connect: { id: data.jadwalSeminarId } },
                mahasiswa: { connect: { nim: data.nim } },
                ...(data.dosenPembimbingId && {
                    dosenPembimbing: { connect: { id: data.dosenPembimbingId } }
                }),
                ...(data.dosenPengujiId && {
                    dosenPenguji: { connect: { id: data.dosenPengujiId } }
                }),
                ...(data.pembimbingInstansiId && {
                    pembimbingInstansi: { connect: { id: data.pembimbingInstansiId } }
                }),
                nilaiPembimbing: data.nilaiPembimbing,
                nilaiPenguji: data.nilaiPenguji,
                nilaiPembimbingInstansi: data.nilaiPembimbingInstansi,
            }
        });
    }

    async updateNilai(id: string, data: UpdateNilaiDTO) {
        return prisma.nilai.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            }
        });
    }

    async getNilaiByNim(nim: string) {
        return prisma.nilai.findMany({
            where: { nim },
            include: {
                jadwalSeminar: true,
                dosenPembimbing: {
                    include: { user: true }
                },
                dosenPenguji: {
                    include: { user: true }
                },
                pembimbingInstansi: true,
            }
        });
    }

    async finalisasiNilai(id: string, dosenId: string) {
        const nilaiData = await prisma.nilai.findUnique({
            where: { id }
        });

        if (!nilaiData) {
            throw new Error('Nilai tidak ditemukan');
        }

        const { nilaiPembimbing, nilaiPenguji, nilaiPembimbingInstansi } = nilaiData;

        if (!nilaiPembimbing || !nilaiPenguji || !nilaiPembimbingInstansi) {
            throw new Error('Semua komponen nilai harus diisi sebelum finalisasi');
        }

        // Hitung nilai akhir (contoh: rata-rata dari ketiga nilai)
        const nilaiAkhir = (nilaiPembimbing + nilaiPenguji + nilaiPembimbingInstansi) / 3;

        return prisma.nilai.update({
            where: { id },
            data: {
                nilaiAkhir,
                isFinalized: true,
                finalizedBy: dosenId,
                finalizedAt: new Date(),
            }
        });
    }
}