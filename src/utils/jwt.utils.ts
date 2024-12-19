import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'

interface TokenPayload {
    id: string
    email: string
    role: Role
}

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRATION
    })
}

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
}