export interface CreateJadwalDTO {
    tanggal: string;
    waktuMulai: string;
    mahasiswaId: string;
    dosenPengujiId: string;
    ruangan: string;
}

export interface MahasiswaResponse {
    id: string;
    nama: string;
    nim: string;
    judul: string;
}

export interface DosenResponse {
    id: string;
    nama: string;
}