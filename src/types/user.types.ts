import { Role } from '@prisma/client';

export interface CreateUserDTO {
    nama: string;
    email: string;
    password: string;
    roles: Role[];
}

export interface UpdateUserDTO {
    nama?: string;
    email?: string;
    password?: string;
    roles?: Role[];
}

export interface UserProfileDTO {
    id: string;
    nama: string;
    email: string;
    role: Role;
    photoPath: string | null;
    createdAt: Date;
}

export interface GetUsersQuery {
    page?: number;
    pageSize?: number;
    role?: Role;
    sortBy?: 'nama' | 'createdAt' | 'role';
    sortOrder?: 'asc' | 'desc';
}