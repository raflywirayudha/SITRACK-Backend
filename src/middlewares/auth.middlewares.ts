import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../configs/prisma.configs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here'

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1]

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as {
                id: string,
                email: string,
                role: 'mahasiswa' | 'dosen_pembimbing' | 'dosen_penguji' | 'kaprodi' | 'koordinator' | 'pembimbing_instansi'
            }

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, role: true }
            })

            if (!user) {
                return res.status(401).json({ message: 'User not found' })
            }

            req.user = user
            next()
        } catch (error) {
            return res.status(403).json({ message: 'Invalid token' })
        }
    } else {
        res.status(401).json({ message: 'Authorization token required' })
    }
}

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized access' })
        }
        next()
    }
}