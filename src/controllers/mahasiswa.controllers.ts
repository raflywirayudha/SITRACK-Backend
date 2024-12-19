import { Request, Response } from 'express'
import prisma from "../utils/prisma.utils"

export class MahasiswaController {
    // Enum untuk tahapan dokumen
    private static TAHAPAN_DOKUMEN = {
        PERSYARATAN: [
            'SURAT_KETERANGAN_SELESAI_KP',
            'LEMBAR_PERNYATAAN_SELESAI_KP',
            'DAILY_REPORT',
            'LAPORAN_TAMBAHAN_KP',
            'SURAT_BIMBINGAN_DOSEN',
            'SETORAN_HAFALAN',
            'FORM_KEHADIRAN_SEMINAR'
        ],
        PENDAFTARAN: [
            'LEMBAR_PERNYATAAN_SELESAI_KP',
            'SURAT_BIMBINGAN_DOSEN',
            'SETORAN_HAFALAN',
            'PENGAJUAN_PENDAFTARAN_DISEMINASI'
        ],
        PASCA_SEMINAR: [
            'SURAT_UNDANGAN_SEMINAR_HASIL',
            'BERITA_ACARA_SEMINAR',
            'DAFTAR_HADIR_SEMINAR',
            'LEMBAR_PENGESAHAN_KP'
        ]
    }

    // Upload Dokumen
    async uploadDokumen(req: Request, res: Response) {
        try {
            const { userId, nim, jenisDokumen, kategori } = req.body
            const file = req.file

            // Validasi jenis dokumen sesuai tahapan
            if (!this.validateDokumen(jenisDokumen, kategori)) {
                return res.status(400).json({ message: 'Dokumen tidak sesuai dengan tahapan' })
            }

            // Cari koordinator KP
            const koordinator = await prisma.dosen.findFirst({
                where: { isKoordinator: true }
            })

            if (!koordinator) {
                return res.status(404).json({ message: 'Koordinator KP tidak ditemukan' })
            }

            const dokumen = await prisma.dokumen.create({
                data: {
                    nim,
                    userId,
                    koordinatorId: koordinator.id,
                    jenisDokumen,
                    kategori,
                    filePath: file?.path || '', // Sesuaikan dengan logic upload file Anda
                    status: 'submitted'
                }
            })

            res.status(201).json(dokumen)
        } catch (error) {
            console.error('Error upload dokumen:', error)
            res.status(500).json({ message: 'Gagal upload dokumen' })
        }
    }

    // Update Dokumen
    async updateDokumen(req: Request, res: Response) {
        try {
            const { dokumentId } = req.params
            const { jenisDokumen, kategori } = req.body
            const file = req.file

            // Validasi jenis dokumen sesuai tahapan
            if (!this.validateDokumen(jenisDokumen, kategori)) {
                return res.status(400).json({ message: 'Dokumen tidak sesuai dengan tahapan' })
            }

            const dokumen = await prisma.dokumen.update({
                where: { id: dokumentId },
                data: {
                    jenisDokumen,
                    kategori,
                    filePath: file?.path || '',
                    tanggalUpload: new Date(),
                    status: 'submitted'
                }
            })

            res.status(200).json(dokumen)
        } catch (error) {
            console.error('Error update dokumen:', error)
            res.status(500).json({ message: 'Gagal update dokumen' })
        }
    }

    // Pendaftaran KP
    async daftarKP(req: Request, res: Response) {
        try {
            const {
                nim,
                judulLaporan,
                namaInstansi,
                alamatInstansi,
                mulaiKp,
                selesaiKp,
                namaPembimbingInstansi,
                noTeleponPembimbing,
                emailPembimbingInstansi
            } = req.body

            const mahasiswaKp = await prisma.mahasiswaKp.create({
                data: {
                    nim,
                    judulLaporan,
                    namaInstansi,
                    alamatInstansi,
                    mulaiKp: new Date(mulaiKp),
                    selesaiKp: new Date(selesaiKp),
                    namaPembimbingInstansi,
                    noTeleponPembimbing,
                    emailPembimbingInstansi
                }
            })

            res.status(201).json(mahasiswaKp)
        } catch (error) {
            console.error('Error pendaftaran KP:', error)
            res.status(500).json({ message: 'Gagal mendaftar KP' })
        }
    }

    // Tampilkan Dokumen yang Sudah Terkirim
    async getDokumenTerkirim(req: Request, res: Response) {
        try {
            const { nim } = req.params

            const dokumen = await prisma.dokumen.findMany({
                where: { nim },
                orderBy: { tanggalUpload: 'desc' }
            })

            res.status(200).json(dokumen)
        } catch (error) {
            console.error('Error ambil dokumen:', error)
            res.status(500).json({ message: 'Gagal mengambil dokumen' })
        }
    }

    // Validasi Dokumen berdasarkan Tahapan
    private validateDokumen(jenisDokumen: string, kategori: string): boolean {
        const tahapanDokumen = MahasiswaController.TAHAPAN_DOKUMEN

        switch(kategori) {
            case 'PERSYARATAN':
                return tahapanDokumen.PERSYARATAN.includes(jenisDokumen)
            case 'PENDAFTARAN':
                return tahapanDokumen.PENDAFTARAN.includes(jenisDokumen)
            case 'PASCA_SEMINAR':
                return tahapanDokumen.PASCA_SEMINAR.includes(jenisDokumen)
            default:
                return false
        }
    }
}

export default new MahasiswaController()