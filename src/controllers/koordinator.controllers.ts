import { Request, Response } from 'express';
import { KoordinatorServices } from '../services/koordinator.services';
import { RegisterSchema } from '../types/user.types';
import { ZodError } from 'zod';

const koordinatorService = new KoordinatorServices();

export class KoordinatorController {
    private koordinatorServices: KoordinatorServices;

    constructor() {
        this.koordinatorServices = new KoordinatorServices();
    }

    register = async (req: Request, res: Response) => {
        try {
            // Validate input
            const validatedInput = RegisterSchema.parse(req.body);

            // Process registration
            const result = await this.koordinatorServices.register(validatedInput);

            return res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    id: result.id,
                    email: result.email,
                    nama: result.nama,
                }
            });

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }

            if (error instanceof Error) {
                // Handle known error types
                if (error.message.includes('already exists')) {
                    return res.status(409).json({
                        success: false,
                        message: error.message
                    });
                }

                if (error.message.includes('not found')) {
                    return res.status(404).json({
                        success: false,
                        message: error.message
                    });
                }

                if (error.message.includes('required')) {
                    return res.status(400).json({
                        success: false,
                        message: error.message
                    });
                }
            }

            // Default error response
            console.error('Registration error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
}