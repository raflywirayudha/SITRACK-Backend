-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `photoPath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` ENUM('mahasiswa', 'dosen_pembimbing', 'dosen_penguji', 'kaprodi', 'koordinator', 'pembimbing_instansi') NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserRole_userId_roleId_key`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mahasiswa` (
    `id` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NULL,
    `semester` INTEGER NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Mahasiswa_nim_key`(`nim`),
    UNIQUE INDEX `Mahasiswa_noHp_key`(`noHp`),
    UNIQUE INDEX `Mahasiswa_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dosen` (
    `id` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `isPembimbing` BOOLEAN NOT NULL DEFAULT false,
    `isPenguji` BOOLEAN NOT NULL DEFAULT false,
    `isKaprodi` BOOLEAN NOT NULL DEFAULT false,
    `isKoordinator` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Dosen_nip_key`(`nip`),
    UNIQUE INDEX `Dosen_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembimbingInstansi` (
    `id` VARCHAR(191) NOT NULL,
    `instansi` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NULL,
    `noTelpon` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PembimbingInstansi_noTelpon_key`(`noTelpon`),
    UNIQUE INDEX `PembimbingInstansi_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MahasiswaKp` (
    `id` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NULL,
    `pembimbingInstansiId` VARCHAR(191) NULL,
    `dosenPembimbingId` VARCHAR(191) NULL,
    `mulaiKp` DATETIME(3) NULL,
    `selesaiKp` DATETIME(3) NULL,
    `judulLaporan` VARCHAR(191) NULL,
    `namaInstansi` VARCHAR(191) NULL,
    `alamatInstansi` VARCHAR(191) NULL,
    `namaPembimbingInstansi` VARCHAR(191) NULL,
    `jabatanPembimbingInstansi` VARCHAR(191) NULL,
    `noTeleponPembimbing` VARCHAR(191) NULL,
    `emailPembimbingInstansi` VARCHAR(191) NULL,

    UNIQUE INDEX `MahasiswaKp_nim_key`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dokumen` (
    `id` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `jenisDokumen` ENUM('SURAT_KETERANGAN_SELESAI_KP', 'LEMBAR_PERNYATAAN_SELESAI_KP', 'DAILY_REPORT', 'LAPORAN_TAMBAHAN_KP', 'SURAT_BIMBINGAN_DOSEN', 'SETORAN_HAFALAN', 'FORM_KEHADIRAN_SEMINAR', 'LEMBAR_FORM_BIMBINGAN', 'PENGAJUAN_PENDAFTARAN_DISEMINASI', 'SURAT_UNDANGAN_SEMINAR_HASIL', 'BERITA_ACARA_SEMINAR', 'DAFTAR_HADIR_SEMINAR', 'LEMBAR_PENGESAHAN_KP') NOT NULL,
    `kategori` ENUM('PERSYARATAN', 'PENDAFTARAN', 'PASCA_SEMINAR') NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `tanggalUpload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('submitted', 'verified', 'rejected') NOT NULL DEFAULT 'submitted',

    INDEX `Dokumen_nim_idx`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DokumenHistory` (
    `id` VARCHAR(191) NOT NULL,
    `dokumenId` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `jenisDokumen` ENUM('SURAT_KETERANGAN_SELESAI_KP', 'LEMBAR_PERNYATAAN_SELESAI_KP', 'DAILY_REPORT', 'LAPORAN_TAMBAHAN_KP', 'SURAT_BIMBINGAN_DOSEN', 'SETORAN_HAFALAN', 'FORM_KEHADIRAN_SEMINAR', 'LEMBAR_FORM_BIMBINGAN', 'PENGAJUAN_PENDAFTARAN_DISEMINASI', 'SURAT_UNDANGAN_SEMINAR_HASIL', 'BERITA_ACARA_SEMINAR', 'DAFTAR_HADIR_SEMINAR', 'LEMBAR_PENGESAHAN_KP') NOT NULL,
    `kategori` ENUM('PERSYARATAN', 'PENDAFTARAN', 'PASCA_SEMINAR') NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `tanggalUpload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `version` INTEGER NOT NULL DEFAULT 1,

    INDEX `DokumenHistory_nim_dokumenId_idx`(`nim`, `dokumenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DokumenReview` (
    `id` VARCHAR(191) NOT NULL,
    `dokumenId` VARCHAR(191) NOT NULL,
    `historyId` VARCHAR(191) NOT NULL,
    `koordinatorId` VARCHAR(191) NOT NULL,
    `status` ENUM('submitted', 'verified', 'rejected') NOT NULL,
    `komentar` VARCHAR(191) NULL,
    `tanggalReview` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nim` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DokumenReview_historyId_key`(`historyId`),
    INDEX `DokumenReview_dokumenId_historyId_idx`(`dokumenId`, `historyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalSeminar` (
    `id` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `waktuMulai` DATETIME(3) NOT NULL,
    `waktuSelesai` DATETIME(3) NOT NULL,
    `ruangan` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `dosenId` VARCHAR(191) NOT NULL,

    INDEX `JadwalSeminar_nim_idx`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nilai` (
    `id` VARCHAR(191) NOT NULL,
    `jadwalSeminarId` VARCHAR(191) NOT NULL,
    `nilaiPembimbing` DOUBLE NULL,
    `nilaiPenguji` DOUBLE NULL,
    `nilaiPembimbingInstansi` DOUBLE NULL,
    `dosenPembimbingId` VARCHAR(191) NULL,
    `dosenPengujiId` VARCHAR(191) NULL,
    `pembimbingInstansiId` VARCHAR(191) NULL,
    `nilaiAkhir` DOUBLE NULL,
    `isFinalized` BOOLEAN NOT NULL DEFAULT false,
    `finalizedBy` VARCHAR(191) NULL,
    `finalizedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `nim` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Nilai_jadwalSeminarId_key`(`jadwalSeminarId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dosen` ADD CONSTRAINT `Dosen_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembimbingInstansi` ADD CONSTRAINT `PembimbingInstansi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MahasiswaKp` ADD CONSTRAINT `MahasiswaKp_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MahasiswaKp` ADD CONSTRAINT `MahasiswaKp_pembimbingInstansiId_fkey` FOREIGN KEY (`pembimbingInstansiId`) REFERENCES `PembimbingInstansi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MahasiswaKp` ADD CONSTRAINT `MahasiswaKp_dosenPembimbingId_fkey` FOREIGN KEY (`dosenPembimbingId`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokumen` ADD CONSTRAINT `Dokumen_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokumen` ADD CONSTRAINT `Dokumen_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DokumenHistory` ADD CONSTRAINT `DokumenHistory_dokumenId_fkey` FOREIGN KEY (`dokumenId`) REFERENCES `Dokumen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DokumenHistory` ADD CONSTRAINT `DokumenHistory_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DokumenHistory` ADD CONSTRAINT `DokumenHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DokumenReview` ADD CONSTRAINT `DokumenReview_dokumenId_fkey` FOREIGN KEY (`dokumenId`) REFERENCES `Dokumen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DokumenReview` ADD CONSTRAINT `DokumenReview_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `DokumenHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DokumenReview` ADD CONSTRAINT `DokumenReview_koordinatorId_fkey` FOREIGN KEY (`koordinatorId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DokumenReview` ADD CONSTRAINT `DokumenReview_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DokumenReview` ADD CONSTRAINT `DokumenReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalSeminar` ADD CONSTRAINT `JadwalSeminar_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalSeminar` ADD CONSTRAINT `JadwalSeminar_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_jadwalSeminarId_fkey` FOREIGN KEY (`jadwalSeminarId`) REFERENCES `JadwalSeminar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_dosenPembimbingId_fkey` FOREIGN KEY (`dosenPembimbingId`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_dosenPengujiId_fkey` FOREIGN KEY (`dosenPengujiId`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_pembimbingInstansiId_fkey` FOREIGN KEY (`pembimbingInstansiId`) REFERENCES `PembimbingInstansi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_finalizedBy_fkey` FOREIGN KEY (`finalizedBy`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
