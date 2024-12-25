import { Request, Response, NextFunction } from 'express';
import { RoleType } from '@prisma/client';

export const roleMiddleware = (allowedRoles: RoleType[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRoles = req.user?.roles || [];

            const hasPermission = allowedRoles.some(role =>
                userRoles.includes(role)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized: Insufficient permissions'
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};