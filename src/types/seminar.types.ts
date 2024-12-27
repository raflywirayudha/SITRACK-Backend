// src/types/seminar.types.ts
import { JadwalSeminar, Nilai, StatusSeminar } from '@prisma/client';

export interface CreateNilaiDTO {
    jadwalSeminarId: string;
    nilaiPenguji: number;
    dosenPengujiId: string;
    nim: string;
}

export interface UpdateNilaiDTO {
    jadwalSeminarId: string;
    nilaiPenguji: number;
    dosenPengujiId: string;
}

export interface SeminarResponse extends JadwalSeminar {
    mahasiswa: {
        nim: string;
        user: {
            nama: string;
            email: string;
        };
        mahasiswaKp: {
            judulLaporan: string;
            dosenPembimbing: {
                user: {
                    nama: string;
                };
            };
            pembimbingInstansi: {
                user: {
                    nama: string;
                };
            };
        };
    };
    nilai?: Nilai | null;
}

export interface NilaiResponse extends Nilai {
    dosenPembimbing?: {
        user: {
            nama: string;
        };
    };
    dosenPenguji?: {
        user: {
            nama: string;
        };
    };
    pembimbingInstansi?: {
        user: {
            nama: string;
        };
    };
}

export interface Student {
    id: string;
    nim: string;
    nama: string;
    semester?: number;
    noHp?: string;
}

export interface SeminarSchedule {
    id: string;
    tanggal: Date;
    waktuMulai: Date;
    waktuSelesai: Date;
    ruangan: string;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
}

export interface StudentWithSchedule extends Student {
    jadwalSeminar: SeminarSchedule;
}