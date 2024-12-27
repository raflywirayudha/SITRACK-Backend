export interface Mahasiswa {
    id: string;
    nama: string;
    nim: string;
    judul: string;
}

export interface DosenPenguji {
    id: string;
    nama: string;
}

export interface JadwalSeminar {
    id: string;
    tanggal: string;
    waktuMulai: string;
    waktuSelesai: string;
    mahasiswaId: string;
    dosenPengujiId: string;
    ruangan: string;
}

export interface JadwalSeminarWithDetails {
    id: string;
    tanggal: Date;
    waktuMulai: Date;
    waktuSelesai: Date;
    ruangan: string;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
    mahasiswa: {
        nim: string;
        user: {
            nama: string;
        };
        mahasiswaKp: {
            judulLaporan: string;
            namaInstansi: string;
            dosenPembimbing: {
                user: {
                    nama: string;
                };
            };
        };
    };
    nilai?: {
        nilaiPenguji: number | null;
    };
}