import express from "express";
import {authenticateToken, authorizeRoles} from "../middlewares/auth.middlewares";
import { getCurrentUser, PembimbingInstansiController } from "../controllers/pembimbinginstansi.controllers"

const router  = express.Router();

const pembimbingInstansiController = new PembimbingInstansiController();
router.get(
    "/pembimbinginstansi/me",
    authenticateToken,
    authorizeRoles(['pembimbing_instansi']),
    getCurrentUser
)
router.get(
    "/pembimbinginstansi/mahasiswa",
    authenticateToken,
    authorizeRoles(['pembimbing_instansi']),
    pembimbingInstansiController.getStudents
)
router.get(
    "/pembimbinginstansi/mahasiswa/:nim/nilai",
    authenticateToken,
    authorizeRoles(['pembimbing_instansi']),
    pembimbingInstansiController.getNilaiMahasiswa
)
router.post(
    "/pembimbinginstansi/mahasiswa/:nim/nilai",
    authenticateToken,
    authorizeRoles(['pembimbing_instansi']),
    pembimbingInstansiController.inputNilai
)

export default router;