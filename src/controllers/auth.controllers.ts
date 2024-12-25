import { Request, Response } from 'express';
import { AuthService } from '../services/auth.services';
import { RegisterSchema } from '../types/auth.types';
import { z } from 'zod';

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
}