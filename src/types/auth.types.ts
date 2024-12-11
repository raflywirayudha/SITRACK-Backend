import { Role } from '@prisma/client'

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO extends LoginDTO {
    role: Role;
    nama: string;
    nim?: string;
    nip?: string;
    instansi?: string;
    jabatan?: string;
    noHp?: string;
    noTelpon?: string;
    semester?: number;
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: Role;
}