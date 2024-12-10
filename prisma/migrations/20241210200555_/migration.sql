-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('mahasiswa', 'dosen_pembimbing', 'dosen_penguji', 'kaprodi', 'koordinator_kp', 'pembimbing_instansi') NOT NULL,
    `photoPath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
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

    UNIQUE INDEX `MahasiswaKp_nim_key`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dokumen` (
    `id` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `koordinatorId` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `jenisDokumen` ENUM('SURAT_KETERANGAN_SELESAI', 'LEMBAR_PERNYATAAN', 'DAILY_REPORT', 'LAPORAN_TAMBAHAN', 'SURAT_BIMBINGAN_DOSEN', 'SETORAN_HAFALAN', 'FORM_KEHADIRAN_SEMINAR', 'PENDAFTARAN_KP', 'PERSYARATAN', 'PASCA_SEMINAR') NOT NULL,
    `persyaratanId` VARCHAR(191) NULL,
    `pendaftaranId` VARCHAR(191) NULL,
    `pascaSeminarId` VARCHAR(191) NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `tanggalUpload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('submitted', 'verified', 'rejected') NOT NULL DEFAULT 'submitted',
    `komentar` VARCHAR(191) NULL,

    INDEX `Dokumen_nim_idx`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Persyaratan` (
    `id` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `tanggalUpload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('submitted', 'verified', 'rejected') NOT NULL DEFAULT 'submitted',
    `komentar` VARCHAR(191) NULL,

    INDEX `Persyaratan_nim_idx`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pendaftaran` (
    `id` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `namaInstansi` VARCHAR(191) NOT NULL,
    `alamatInstansi` VARCHAR(191) NOT NULL,
    `mulaiKp` DATETIME(3) NOT NULL,
    `selesaiKp` DATETIME(3) NOT NULL,

    INDEX `Pendaftaran_nim_idx`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembimbingInstansiDetail` (
    `id` VARCHAR(191) NOT NULL,
    `pendaftaranId` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NULL,
    `noTelepon` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    UNIQUE INDEX `PembimbingInstansiDetail_pendaftaranId_key`(`pendaftaranId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PascaSeminar` (
    `id` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `tanggalUpload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('submitted', 'verified', 'rejected') NOT NULL DEFAULT 'submitted',
    `komentar` VARCHAR(191) NULL,

    INDEX `PascaSeminar_nim_idx`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nilai` (
    `id` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NULL,
    `jadwal` DATETIME(3) NULL,
    `ruangan` VARCHAR(191) NULL,
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

    UNIQUE INDEX `Nilai_nim_key`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Dokumen` ADD CONSTRAINT `Dokumen_koordinatorId_fkey` FOREIGN KEY (`koordinatorId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokumen` ADD CONSTRAINT `Dokumen_persyaratanId_fkey` FOREIGN KEY (`persyaratanId`) REFERENCES `Persyaratan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokumen` ADD CONSTRAINT `Dokumen_pendaftaranId_fkey` FOREIGN KEY (`pendaftaranId`) REFERENCES `Pendaftaran`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokumen` ADD CONSTRAINT `Dokumen_pascaSeminarId_fkey` FOREIGN KEY (`pascaSeminarId`) REFERENCES `PascaSeminar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Persyaratan` ADD CONSTRAINT `Persyaratan_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembimbingInstansiDetail` ADD CONSTRAINT `PembimbingInstansiDetail_pendaftaranId_fkey` FOREIGN KEY (`pendaftaranId`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PascaSeminar` ADD CONSTRAINT `PascaSeminar_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_dosenPembimbingId_fkey` FOREIGN KEY (`dosenPembimbingId`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_dosenPengujiId_fkey` FOREIGN KEY (`dosenPengujiId`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_pembimbingInstansiId_fkey` FOREIGN KEY (`pembimbingInstansiId`) REFERENCES `PembimbingInstansi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nilai` ADD CONSTRAINT `Nilai_finalizedBy_fkey` FOREIGN KEY (`finalizedBy`) REFERENCES `Dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
