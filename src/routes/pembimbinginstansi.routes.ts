import express from "express";
import {authenticateToken, authorizeRoles} from "../middlewares/auth.middlewares";
import { getCurrentUser, PembimbingInstansiController } from "../controllers/pembimbinginstansi.controllers"
import { GradeController } from "../controllers/grade.controllers"

const router  = express.Router();

const pembimbingInstansiController = new PembimbingInstansiController();
const gradeController = new GradeController();
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
router.post(
    "/pembimbing_instansi/:nim/nilai",
    authenticateToken,
    authorizeRoles(['pembimbing_instansi']),
    gradeController.submitGrade
)

router.get(
    "/pembimbing_instansi/:nim/nilai",
    authenticateToken,
    authorizeRoles(['pembimbing_instansi']),
    gradeController.getGrade
)

export default router;