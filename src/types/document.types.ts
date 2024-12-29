import {JenisDokumen, KategoriDokumen, DokumenStatus} from "@prisma/client";

export interface Document {
    id: string;
    nim: string;
    userId: string;
    jenisDokumen: JenisDokumen;
    kategori: KategoriDokumen;
    filePath: string;
    tanggalUpload: Date;
    status: DokumenStatus;
}

export interface CreateDocumentReviewDTO {
    dokumenId: string;
    koordinatorId: string;
    status: DokumenStatus;
    komentar?: string;
}

export interface UpdateDocumentStatusDTO {
    status: 'submitted' | 'verified' | 'rejected';
    komentar?: string;
}

export interface DocumentResponse {
    id: string;
    jenisDokumen: JenisDokumen;
    kategori: KategoriDokumen;
    status: DokumenStatus;
    filePath: string;
    tanggalUpload: Date;
}