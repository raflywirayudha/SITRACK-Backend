import {Request, Response, NextFunction} from 'express';
import prisma from "../utils/prisma.utils";
import {RegisterSchema, LoginSchema} from "../utils/validation.schemas";
import {hashPassword} from "../utils/password.utils";
import { verifyToken } from "../utils/jwt.utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRATION = process.env.JWT_EXPIRATION

export const registerController = async (req: Request, res: Response) => {
    try {
        // Validate input
        const {name, email, password} = RegisterSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {email}
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email sudah terdaftar'
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user with default mahasiswa role
        const user = await prisma.user.create({
            data: {
                nama: name,
                email,
                password: hashedPassword,
                role: 'mahasiswa', // Default role as specified
                mahasiswa: {
                    create: {
                        nim: `temp-${Date.now()}` // Temporary NIM, should be updated later
                    }
                }
            },
            include: {
                mahasiswa: true
            }
        });

        // Remove sensitive data before sending response
        const {password: _, ...userResponse} = user;

        res.status(201).json({
            message: 'Registrasi berhasil',
            user: userResponse
        });
    } catch (error: any) {
        console.error('Registration error:', error);

        // Handle Zod validation errors
        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: 'Validasi data gagal',
                errors: error.errors
            });
        }

        res.status(500).json({
            message: 'Registrasi gagal. Silakan coba lagi.'
        });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        )

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const validateTokenController = (req: Request, res: Response) => {
    try {
        // Ambil token dari header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Token tidak ditemukan' });
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN

        // Verifikasi token
        const decoded = verifyToken(token);

        res.status(200).json({
            message: 'Token valid',
            user: decoded
        });
    } catch (error) {
        console.error('Token validation error:', error);
        return res.status(401).json({ message: 'Token tidak valid' });
    }
};