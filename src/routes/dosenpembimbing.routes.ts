import express from "express";
import {authenticateToken, authorizeRoles} from "../middlewares/auth.middlewares";
import { getCurrentUser, DosenPembimbingController } from "../controllers/dosenpembimbing.controllers"

const router  = express.Router();

const dosenPembimbingController = new DosenPembimbingController();

router.get(
    "/dosenpembimbing/me",
    authenticateToken,
    authorizeRoles(['dosen_pembimbing']),
    getCurrentUser
)

router.get(
    "/dosenpembimbing/:dosenId/mahasiswa",
    authenticateToken,
    authorizeRoles(['dosen_pembimbing']),
    dosenPembimbingController.getMahasiswaBimbingan
)

router.post(
    "/dosenpembimbing/:dosenId/nilai",
    authenticateToken,
    authorizeRoles(['dosen_pembimbing']),
    dosenPembimbingController.inputNilai
)

router.get(
    "/dosenpembimbing/:dosenId/nilai/:nim",
    authenticateToken,
    authorizeRoles(['dosen_pembimbing']),
    dosenPembimbingController.getNilai
)

export default router;