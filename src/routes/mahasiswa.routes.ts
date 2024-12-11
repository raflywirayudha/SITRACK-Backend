import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares.js";
import {authorizeRoles} from "../middlewares/protected.middlewares.js";
import mahasiswaController from "../controllers/mahasiswa.controllers"

const router = express.Router();

router.post(
    "/mahasiswa/persyaratan",
    mahasiswaController.uploadPersyaratan
)

router.post(
    "/mahasiswa/pendaftaran",
    mahasiswaController.daftarKp
)

router.post(
    "/mahasiswa/pascaseminar",
    mahasiswaController.uploadPascaSeminar
)

export default router;