export interface StudentResponse {
    id: string;
    nim: string;
    noHp: string | null;
    semester: number | null;
    user: {
        id: string;
        email: string;
        nama: string;
        photoPath: string | null;
    };
    dokumen: {
        id: string;
        jenisDokumen: string;
        kategori: string;
        filePath: string;
        tanggalUpload: Date;
        status: string;
    }[];
}

export interface Student {
    name: string;
    nim: string;
    department: string;
    status: "Menunggu Seminar" | "Selesai Seminar" | "Sedang Berlangsung";
    company: string;
    pembimbing: string;
    judulKP: string;
    action: "Input Nilai" | "Lihat Nilai";
}