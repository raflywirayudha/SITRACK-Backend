import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RoleType } from '@prisma/client';

const createUserSchema = z.object({
    nama: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    roles: z.array(z.nativeEnum(RoleType)).min(1, 'At least one role is required')
});

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        createUserSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        next(error);
    }
};