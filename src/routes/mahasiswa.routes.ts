import express from "express";
import mahasiswaController from "../controllers/mahasiswa.controllers"
import uploadMiddleware from "../middlewares/upload.middlewares";

const router = express.Router();

router.post(
    "/mahasiswa/upload",
    uploadMiddleware.single("dokumen"),
    mahasiswaController.uploadDokumen
)

router.put(
    "/mahasiswa/dokumen/:dokumenId",
    uploadMiddleware.single("dokumen"),
    mahasiswaController.updateDokumen
)

router.post(
    "/mahasiswa/pendaftaran",
    mahasiswaController.daftarKP
)

router.get(
    "/mahasiswa/dokumen/:nim",
    mahasiswaController.getDokumenTerkirim
)

export default router;