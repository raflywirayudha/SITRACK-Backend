import {JenisDokumen, KategoriDokumen} from "@prisma/client";

export const getRequiredDocuments= (kategori: KategoriDokumen): JenisDokumen[] =>    {
    switch (kategori) {
        case KategoriDokumen.PERSYARATAN:
            return [
                JenisDokumen.SURAT_KETERANGAN_SELESAI_KP,
                JenisDokumen.LEMBAR_PERNYATAAN_SELESAI_KP,
                JenisDokumen.DAILY_REPORT,
                JenisDokumen.LAPORAN_TAMBAHAN_KP,
                JenisDokumen.SURAT_BIMBINGAN_DOSEN,
                JenisDokumen.SETORAN_HAFALAN,
                JenisDokumen.FORM_KEHADIRAN_SEMINAR
            ];
        case KategoriDokumen.PENDAFTARAN:
            return [
                JenisDokumen.LEMBAR_FORM_BIMBINGAN,
                JenisDokumen.PENGAJUAN_PENDAFTARAN_DISEMINASI
            ];
        case KategoriDokumen.PASCA_SEMINAR:
            return [
                JenisDokumen.SURAT_UNDANGAN_SEMINAR_HASIL,
                JenisDokumen.BERITA_ACARA_SEMINAR,
                JenisDokumen.DAFTAR_HADIR_SEMINAR,
                JenisDokumen.LEMBAR_PENGESAHAN_KP
            ];
        default:
            return [];
    }
}