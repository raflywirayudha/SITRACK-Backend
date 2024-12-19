import { z } from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

export const LoginSchema = z.object({
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z.string().min(1, { message: "Password tidak boleh kosong" })
});