import {JenisDokumen, KategoriDokumen} from "@prisma/client";

export interface UploadDocumentDto {
    nim: string;
    userId: string;
    jenisDokumen: JenisDokumen;
    kategori: KategoriDokumen;
    file: Express.Multer.File;
}