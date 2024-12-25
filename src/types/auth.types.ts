import { z } from 'zod';

export const RegisterSchema = z.object({
    nama: z.string().min(1, "Nama is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    nim: z.string().min(11, "Masukkan NIM yang terdaftar"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

import { RoleType } from '@prisma/client';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export interface JWTPayload {
    userId: string;
    email: string;
    roles: RoleType[];
}