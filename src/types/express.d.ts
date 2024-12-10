// Di file types/express.d.ts atau di file yang sama dengan controller
import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                nim: string;
                // tambahkan properti lain yang diperlukan
            };
        }
    }
}