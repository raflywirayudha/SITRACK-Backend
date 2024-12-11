import multer from 'multer'
import path from 'path'

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/dokumen_kp/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const uploadMiddleware = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Batasan 5MB
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
        const extname = path.extname(file.originalname).toLowerCase()
        if (allowedFileTypes.includes(extname)) {
            return cb(null, true)
        }
        cb(new Error('Tipe file tidak diizinkan'))
    }
})

export default uploadMiddleware