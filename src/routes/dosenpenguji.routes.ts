import express from "express";
import {authenticateToken, authorizeRoles} from "../middlewares/auth.middlewares";
import { getCurrentUser, DosenPengujiController } from "../controllers/dosenpenguji.controllers"

const router  = express.Router();

const dosenPengujiController = new DosenPengujiController();

router.get(
    "/dosenpenguji/me",
    authenticateToken,
    authorizeRoles(['dosen_penguji']),
    getCurrentUser
)

router.get(
    "/dosenpenguji/mahasiswa/:dosenId",
    authenticateToken,
    authorizeRoles(['dosen_penguji']),
    dosenPengujiController.getStudentsByExaminer
)

export default router;