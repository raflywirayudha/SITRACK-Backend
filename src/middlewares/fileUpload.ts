import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import multer from 'multer';

// Konfigurasi direktori upload
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Konfigurasi multer untuk handling file upload
export const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            // Cek apakah direktori uploads sudah ada, jika belum buat baru
            await fs.mkdir(UPLOAD_DIR, { recursive: true });
            cb(null, UPLOAD_DIR);
        } catch (error) {
            cb(error as Error, UPLOAD_DIR);
        }
    },
    filename: (req, file, cb) => {
        // Generate nama file unik dengan UUID
        const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
        const fileExtension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    }
});

// Konfigurasi filter file
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Daftar mime types yang diizinkan
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed! Please upload PDF, DOC, DOCX, JPG, or PNG files.'));
    }
};

// Membuat instance multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Maksimum 5MB
    }
});

// Fungsi utama untuk upload file
export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
    try {
        // Pastikan direktori upload ada
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        // Generate nama file unik
        const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
        const fileExtension = path.extname(file.originalname);
        const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        // Jika file diunggah menggunakan multer, file sudah ada di sistem
        // Jika tidak, kita perlu menyimpan buffer ke file
        if (file.path) {
            // File sudah disimpan oleh multer, return path relatif
            return path.relative(process.cwd(), file.path);
        } else if (file.buffer) {
            // Simpan buffer ke file
            await fs.writeFile(filePath, file.buffer);
            return path.relative(process.cwd(), filePath);
        }

        throw new Error('No file content provided');
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
    }
};

// Fungsi untuk menghapus file
export const deleteFile = async (filePath: string): Promise<void> => {
    try {
        const absolutePath = path.join(process.cwd(), filePath);
        await fs.unlink(absolutePath);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw new Error('Failed to delete file');
    }
};

// Fungsi untuk memvalidasi ukuran dan tipe file
export const validateFile = (file: Express.Multer.File): void => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('File too large! Maximum size is 5MB.');
    }

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type! Please upload PDF, DOC, DOCX, JPG, or PNG files.');
    }
};