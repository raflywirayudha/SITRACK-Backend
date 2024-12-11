import { JenisDokumen, KategoriDokumen } from "@prisma/client";

export interface BaseDokumenPayload {
    dokumen: {
        jenisDokumen: JenisDokumen;
        filePath: string;
    }[];
}

export interface PersyaratanPayload extends BaseDokumenPayload {}

export interface PendaftaranPayload extends BaseDokumenPayload {
    formData: {
        judulLaporan: string;
        namaInstansi: string;
        alamatInstansi: string;
        mulaiKp: Date;
        selesaiKp: Date;
        namaPembimbingInstansi: string;
        noTeleponPembimbing: string;
        emailPembimbingInstansi: string;
    };
}

export interface PascaSeminarPayload extends BaseDokumenPayload {}