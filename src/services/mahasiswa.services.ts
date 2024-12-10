import {DokumenPayload, PersyaratanDokumen, PendaftaranDokumen, PascaSeminarDokumen} from "../types/document.types"
import {PrismaClient, Prisma} from "@prisma/client";

const prisma = new PrismaClient();

class DokumenService {
    async uploadDokumen(
        nim: string,
        userId: string,
        payload: DokumenPayload
    ) {
        // Validasi dokumen berdasarkan kategori
        this.validateDokumenByKategori(payload);

        const documentData: Prisma.DokumenCreateInput = {
            nim,
            user: {
                connect: { id: userId }
            },
            jenisDokumen: payload.jenisDokumen,
            kategori: payload.kategori,
            filePath: payload.filePath,
            mahasiswa: {
                connect: { nim: nim }
            }
        };

        return prisma.dokumen.create({
            data: documentData
        });
    }

    private validateDokumenByKategori(payload: DokumenPayload) {
        const validDokumenMap = {
            PERSYARATAN: PersyaratanDokumen,
            PENDAFTARAN: PendaftaranDokumen,
            PASCA_SEMINAR: PascaSeminarDokumen
        };

        const validDokumen = validDokumenMap[payload.kategori];

        if (!validDokumen.includes(payload.jenisDokumen)) {
            throw new Error('Dokumen tidak valid untuk kategori ini');
        }
    }

    async getDokumenByMahasiswa(nim: string) {
        return prisma.dokumen.findMany({
            where: { nim }
        });
    }
}

export default new DokumenService();