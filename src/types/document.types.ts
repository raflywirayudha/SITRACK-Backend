import {JenisDokumen, KategoriDokumen} from "@prisma/client";

export interface DokumenPayload {
    jenisDokumen: JenisDokumen;
    kategori: KategoriDokumen;
    filePath: string;
}

export const PersyaratanDokumen: JenisDokumen[] = [
    'SURAT_KETERANGAN_SELESAI_KP',
    'LEMBAR_PERNYATAAN_SELESAI_KP',
    'DAILY_REPORT',
    'LAPORAN_TAMBAHAN_KP',
    'SURAT_BIMBINGAN_DOSEN',
    'SETORAN_HAFALAN',
    'FORM_KEHADIRAN_SEMINAR'
];

export const PendaftaranDokumen: JenisDokumen[] = [
    'LEMBAR_PERNYATAAN_SELESAI_KP',
    'SURAT_BIMBINGAN_DOSEN',
    'SETORAN_HAFALAN',
    'PENGAJUAN_PENDAFTARAN_DISEMINASI'
];

export const PascaSeminarDokumen: JenisDokumen[] = [
    'SURAT_UNDANGAN_SEMINAR_HASIL',
    'BERITA_ACARA_SEMINAR',
    'DAFTAR_HADIR_SEMINAR',
    'LEMBAR_PENGESAHAN_KP'
];