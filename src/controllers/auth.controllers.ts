import { Request, Response } from 'express';
import { AuthService } from '../services/auth.services';
import { RegisterSchema, LoginSchema } from '../types/auth.types';
import { z } from 'zod';
import prisma from "../configs/prisma.configs";
import { validateEmail, validatePassword } from "../utils/forgotpassword.utils"

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public register = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input = RegisterSchema.parse(req.body);

            const existingUser = await this.authService.checkEmailExists(input.email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const user = await this.authService.register(input);

            return res.status(201).json({
                message: 'Registration successful',
                user: {
                    id: user.id,
                    email: user.email,
                    nama: user.nama
                }
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public login = async (req: Request, res: Response): Promise<Response> => {
        try {
            // Validate input using Zod
            const loginDto = LoginSchema.parse(req.body);
            const result = await this.authService.login(loginDto);

            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: error.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                });
            }

            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }

            console.error('Unexpected error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}

export const checkEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: 'Format email tidak valid',
                exists: false
            });
        }

        const exists = await AuthService.checkEmailExists(email);
        return res.json({ exists });
    } catch (error) {
        console.error('Error in checkEmail:', error);
        return res.status(500).json({
            message: 'Terjadi kesalahan internal server',
            exists: false
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: 'Format email tidak valid'
            });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: 'Password harus minimal 8 karakter'
            });
        }

        const updated = await AuthService.resetPassword(email, newPassword);

        if (!updated) {
            return res.status(404).json({
                message: 'Email tidak ditemukan'
            });
        }

        return res.json({
            message: 'Password berhasil diperbarui'
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({
            message: 'Terjadi kesalahan internal server'
        });
    }
};