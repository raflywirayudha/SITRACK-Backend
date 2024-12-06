import multer from 'multer'
import path from 'path'
import fs from 'fs'

const createStorage = (subFolder: string) => multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads', subFolder)
        fs.mkdirSync(uploadPath, { recursive: true })
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploadPersyaratan = multer({
    storage: createStorage('persyaratan'),
    limits: { fileSize: 5 * 1024 * 1024 }
})

export const uploadPendaftaran = multer({
    storage: createStorage('pendaftaran'),
    limits: { fileSize: 5 * 1024 * 1024 }
})

export const uploadPascaSeminar = multer({
    storage: createStorage('pasca-seminar'),
    limits: { fileSize: 5 * 1024 * 1024 }
})