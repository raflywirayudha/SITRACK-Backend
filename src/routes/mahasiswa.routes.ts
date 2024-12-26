import express from "express";
import {authenticateToken, authorizeRoles} from "../middlewares/auth.middlewares";
import {getCurrentUser, MahasiswaControllers} from "../controllers/mahasiswa.controllers";
import {upload} from "../middlewares/fileUpload";

const router = express.Router();
const mahasiswaControllers = new MahasiswaControllers();

router.post(
    "/mahasiswa/upload",
    authenticateToken,
    authorizeRoles(['mahasiswa']),
    upload.single("file"),
    mahasiswaControllers.uploadDocument
)

router.get(
    "/mahasiswa/tahap/:kategori/:nim",
    authenticateToken,
    authorizeRoles(['mahasiswa']),
    mahasiswaControllers.getDocumentsByStage
)

router.get(
    "/mahasiswa/history/:kategori/:nim",
    authenticateToken,
    authorizeRoles(['mahasiswa']),
    mahasiswaControllers.getDocumentHistory
)

router.post(
    "/mahasiswa/pendaftaran",
    authenticateToken,
    authorizeRoles(['mahasiswa']),
    mahasiswaControllers.updateRegistrationData
)

router.get(
    "/mahasiswa/cek-tahapan/:kategori/:nim",
    authenticateToken,
    authorizeRoles(['mahasiswa']),
    mahasiswaControllers.checkStageCompletion
)

router.get(
    "/mahasiswa/me",
    authenticateToken,
    authorizeRoles(['mahasiswa']),
    getCurrentUser
)

export default router;