export interface BaseProfile {
    id: string;
    email: string;
    nama: string;
    photoPath?: string;
}

export interface StudentProfile extends BaseProfile {
    nim: string;
    noHp?: string;
    semester?: number;
    mahasiswaKp?: {
        mulaiKp?: Date;
        selesaiKp?: Date;
        judulLaporan?: string;
        namaInstansi?: string;
    };
}

export interface LecturerProfile extends BaseProfile {
    nip: string;
    isPembimbing: boolean;
    isPenguji: boolean;
    isKaprodi: boolean;
    isKoordinator: boolean;
}

export interface IndustryAdvisorProfile extends BaseProfile {
    instansi: string;
    jabatan?: string;
    noTelpon?: string;
}