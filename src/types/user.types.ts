import { z } from 'zod';

export const RegisterSchema = z.object({
    nama: z.string().min(1, "Nama is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    roles: z.array(z.enum(['mahasiswa', 'dosen_pembimbing', 'dosen_penguji', 'kaprodi', 'koordinator', 'pembimbing_instansi']))
        .min(1, "At least one role is required"),
    nip: z.string().min(1, "Masukkan NIP yang terdaftar")
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface UserResponse {
    id: string;
    nama: string;
    email: string;
    role: string;
    photoPath?: string;
    status?: string;
    nim?: string;
    nip?: string;
    createdAt: string;
}

export interface GetUsersQuery {
    page?: string;
    pageSize?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}