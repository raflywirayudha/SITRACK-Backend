import express from "express";
import {authenticateToken, authorizeRoles} from "../middlewares/auth.middlewares";
import { getCurrentUser, DosenPengujiController, GradeControlleDosenPenguji } from "../controllers/dosenpenguji.controllers"
import { getNilaiByNim, NilaiController } from "../controllers/nilaiDosenPenguji.controllers"

const router  = express.Router();

const dosenPengujiController = new DosenPengujiController();
const gradesControllerDosenPenguji = new GradeControlleDosenPenguji();
const nilaiController = new NilaiController();

router.get(
    "/dosen-penguji/me",
    authenticateToken,
    authorizeRoles(['dosen_penguji']),
    getCurrentUser
)

router.get(
    "/dosen-penguji/mahasiswa/:dosenId",
    authenticateToken,
    authorizeRoles(['dosen_penguji']),
    dosenPengujiController.getStudentsByExaminer
)

router.post(
    "/dosen-penguji/mahasiswa/:dosenId",
    authenticateToken,
    authorizeRoles(['dosen_penguji']),
    gradesControllerDosenPenguji.submitGrade
)

router.get(
    "/dosen-penguji/nilai/:nim",
    authenticateToken,
    authorizeRoles(['dosen_penguji']),
    getNilaiByNim
)

router.get(
    '/dosen-penguji/nilai',
    authenticateToken,
    authorizeRoles(['dosen_penguji']),
    nilaiController.getNilaiPengujiAssignments
);

router.post(
    '/dosen-penguji/inputnilai',
    authenticateToken,
    authorizeRoles(['dosen_penguji']),
    nilaiController.inputNilaiPenguji
);

export default router;
