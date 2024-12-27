import {JenisDokumen, KategoriDokumen} from "@prisma/client";

export interface UploadDocumentDto {
    nim: string;
    userId: string;
    jenisDokumen: JenisDokumen;
    kategori: KategoriDokumen;
    file: Express.Multer.File;
}

export interface DokumenWithDetails {
    id: string;
    nim: string;
    jenisDokumen: string;
    kategori: string;
    filePath: string;
    status: string;
    mahasiswa: {
        user: {
            nama: string;
            email: string;
        }
    }
}

export interface MahasiswaKpWithDetails {
    id: string;
    nim: string;
    judulLaporan: string;
    namaInstansi: string;
    alamatInstansi: string;
    mulaiKp: Date;
    selesaiKp: Date;
    mahasiswa: {
        user: {
            nama: string;
            email: string;
        }
    }
}

export interface DokumenDTO {
    id: string;
    nim: string;
    jenisDokumen: string;
    kategori: string;
    filePath: string;
    status: string;
    tanggalUpload: Date;
}