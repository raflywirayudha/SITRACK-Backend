import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares.js";
import {authorizeRoles} from "../middlewares/protected.middlewares.js";
import uploadMiddlewares from "../middlewares/upload.middlewares";
import mahasiswaController from "../controllers/mahasiswa.controllers"

const router = express.Router();

router.post(
    '/mahasiswa/upload',
    uploadMiddlewares.single('file'),
    mahasiswaController.uploadDokumen
);

router.get(
    "/mahasiswa/dokumen",
    mahasiswaController.getDokumenMahasiswa
)

export default router;