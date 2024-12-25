import { Request, Response, NextFunction } from 'express';

export const validateRequests = (req: Request, res: Response, next: NextFunction) => {
    const { nama, email, password, nim } = req.body;

    if (!nama || !email || !password || !nim) {
        return res.status(400).json({
            success: false,
            message: 'Semua field wajib diisi',
        });
    }

    next();
};
