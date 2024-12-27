import prisma from "../configs/prisma.configs"

// Service untuk menambahkan jadwal seminar
export const createJadwal = async (data: {
    nim: string;
    dosenId: string;
    ruangan: string;
    tanggal: Date;
    waktuMulai: Date;
    waktuSelesai: Date;
}) => {
    return await prisma.jadwalSeminar.create({
        data: {
            nim: data.nim,
            dosenId: data.dosenId,
            ruangan: data.ruangan,
            tanggal: data.tanggal,
            waktuMulai: data.waktuMulai,
            waktuSelesai: data.waktuSelesai,
        },
    });
};

// Service untuk mendapatkan semua jadwal seminar
export const getAllJadwal = async () => {
    return await prisma.jadwalSeminar.findMany({
        include: {
            mahasiswa: {
                select: { nim: true, user: { select: { nama: true } } },
            },
            dosen: {
                select: { user: { select: { nama: true } } },
            },
        },
        orderBy: { tanggal: "asc" },
    });
};
