import express from 'express';
import multer from 'multer';

export const errorHandler = (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    if (err instanceof multer.MulterError) {
        // Terjadi kesalahan Multer saat mengunggah.
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File terlalu besar. Ukuran maksimum adalah 5MB.'
            });
        }
    }
    next(err);
};