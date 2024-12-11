import { Request, Response } from "express";
import mahasiswaServices from "../services/mahasiswa.services";
import upload from "../middlewares/upload.middlewares";

export class TahapanController {
    // Middleware untuk handle multiple file upload
    private uploadMultipleDokumen = upload.array('dokumen');

    // Handler untuk upload persyaratan
    async uploadPersyaratan(req: Request, res: Response) {
        try {
            const { nim } = (req.user as { nim: string });
            const userId = (req.user as { id: string }).id;

            this.uploadMultipleDokumen(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const files = req.files as Express.Multer.File[];

                const payload = {
                    dokumen: files.map(file => ({
                        jenisDokumen: file.originalname, // Atau cara lain menentukan jenis dokumen
                        filePath: file.path
                    }))
                };

                const result = await mahasiswaServices.uploadPersyaratan(
                    nim,
                    userId,
                    payload
                );

                res.status(201).json(result);
            });
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    }

    // Handler untuk pendaftaran KP
    async daftarKp(req: Request, res: Response) {
        try {
            const { nim } = (req.user as { nim: string });
            const userId = (req.user as { id: string }).id;

            this.uploadMultipleDokumen(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const files = req.files as Express.Multer.File[];
                const { formData } = req.body;

                // Parse form data (jika dikirim sebagai JSON string)
                const parsedFormData = JSON.parse(formData);

                const payload = {
                    dokumen: files.map(file => ({
                        jenisDokumen: file.originalname,
                        filePath: file.path
                    })),
                    formData: {
                        ...parsedFormData,
                        mulaiKp: new Date(parsedFormData.mulaiKp),
                        selesaiKp: new Date(parsedFormData.selesaiKp)
                    }
                };

                const result = await mahasiswaServices.daftarKp(
                    nim,
                    userId,
                    payload
                );

                res.status(201).json(result);
            });
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    }

    // Handler untuk upload pasca seminar
    async uploadPascaSeminar(req: Request, res: Response) {
        try {
            const { nim } = (req.user as { nim: string });
            const userId = (req.user as { id: string }).id;

            this.uploadMultipleDokumen(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const files = req.files as Express.Multer.File[];

                const payload = {
                    dokumen: files.map(file => ({
                        jenisDokumen: file.originalname,
                        filePath: file.path
                    }))
                };

                const result = await mahasiswaServices.uploadPascaSeminar(
                    nim,
                    userId,
                    payload
                );

                res.status(201).json(result);
            });
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    }

    // Error handling umum
    private handleError(error: unknown, res: Response) {
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

export default new TahapanController();