import {Request, Response } from "express";
import mahasiswaServices from "../services/mahasiswa.services";
import { DokumenPayload } from '../types/document.types';

export class MahasiswaController {
    async uploadDokumen(req: Request, res: Response) {
        try {
            // Type assertion untuk req.user
            const { nim } = (req.user as { nim: string });
            const userId = (req.user as { id: string }).id;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: 'File tidak ditemukan' });
            }

            const payload: DokumenPayload = {
                jenisDokumen: req.body.jenisDokumen,
                kategori: req.body.kategori,
                filePath: file.path
            };

            const dokumen = await mahasiswaServices.uploadDokumen(
                nim,
                userId,
                payload
            );

            res.status(201).json(dokumen);
        } catch (error: unknown) {
            // Type guard untuk error
            if (error instanceof Error) {
                res.status(400).json({
                    message: error.message
                });
            } else {
                res.status(400).json({
                    message: 'An unknown error occurred'
                });
            }
        }
    }

    async getDokumenMahasiswa(req: Request, res: Response) {
        try {
            const { nim } = (req.user as { nim: string });
            const dokumen = await mahasiswaServices.getDokumenByMahasiswa(nim);
            res.json(dokumen);
        } catch (error: unknown) {
            // Type guard untuk error
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }
}

export default new MahasiswaController();