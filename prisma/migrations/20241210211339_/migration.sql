/*
  Warnings:

  - You are about to drop the column `kategori` on the `Dokumen` table. All the data in the column will be lost.
  - You are about to drop the column `pascaSeminarId` on the `Dokumen` table. All the data in the column will be lost.
  - You are about to drop the column `pendaftaranId` on the `Dokumen` table. All the data in the column will be lost.
  - You are about to drop the column `persyaratanId` on the `Dokumen` table. All the data in the column will be lost.
  - The values [SURAT_KETERANGAN_SELESAI,LEMBAR_PERNYATAAN,LAPORAN_TAMBAHAN,PENDAFTARAN_KP,PERSYARATAN,PASCA_SEMINAR] on the enum `Dokumen_jenisDokumen` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `PascaSeminar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PembimbingInstansiDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pendaftaran` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Persyaratan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Dokumen` DROP FOREIGN KEY `Dokumen_pascaSeminarId_fkey`;

-- DropForeignKey
ALTER TABLE `Dokumen` DROP FOREIGN KEY `Dokumen_pendaftaranId_fkey`;

-- DropForeignKey
ALTER TABLE `Dokumen` DROP FOREIGN KEY `Dokumen_persyaratanId_fkey`;

-- DropForeignKey
ALTER TABLE `PascaSeminar` DROP FOREIGN KEY `PascaSeminar_nim_fkey`;

-- DropForeignKey
ALTER TABLE `PembimbingInstansiDetail` DROP FOREIGN KEY `PembimbingInstansiDetail_pendaftaranId_fkey`;

-- DropForeignKey
ALTER TABLE `Pendaftaran` DROP FOREIGN KEY `Pendaftaran_nim_fkey`;

-- DropForeignKey
ALTER TABLE `Persyaratan` DROP FOREIGN KEY `Persyaratan_nim_fkey`;

-- AlterTable
ALTER TABLE `Dokumen` DROP COLUMN `kategori`,
    DROP COLUMN `pascaSeminarId`,
    DROP COLUMN `pendaftaranId`,
    DROP COLUMN `persyaratanId`,
    MODIFY `jenisDokumen` ENUM('SURAT_KETERANGAN_SELESAI_KP', 'LEMBAR_PERNYATAAN_SELESAI_KP', 'DAILY_REPORT', 'LAPORAN_TAMBAHAN_KP', 'SURAT_BIMBINGAN_DOSEN', 'SETORAN_HAFALAN', 'FORM_KEHADIRAN_SEMINAR', 'LEMBAR_FORM_BIMBINGAN', 'PENGAJUAN_PENDAFTARAN_DISEMINASI', 'SURAT_UNDANGAN_SEMINAR_HASIL', 'BERITA_ACARA_SEMINAR', 'DAFTAR_HADIR_SEMINAR', 'LEMBAR_PENGESAHAN_KP') NOT NULL;

-- AlterTable
ALTER TABLE `MahasiswaKp` ADD COLUMN `alamatInstansi` VARCHAR(191) NULL,
    ADD COLUMN `emailPembimbingInstansi` VARCHAR(191) NULL,
    ADD COLUMN `jabatanPembimbingInstansi` VARCHAR(191) NULL,
    ADD COLUMN `judulLaporan` VARCHAR(191) NULL,
    ADD COLUMN `namaInstansi` VARCHAR(191) NULL,
    ADD COLUMN `namaPembimbingInstansi` VARCHAR(191) NULL,
    ADD COLUMN `noTeleponPembimbing` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `PascaSeminar`;

-- DropTable
DROP TABLE `PembimbingInstansiDetail`;

-- DropTable
DROP TABLE `Pendaftaran`;

-- DropTable
DROP TABLE `Persyaratan`;
