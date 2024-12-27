import express from 'express';
import {KoordinatorController, getCurrentUser} from "../controllers/koordinator.controllers"
import {authenticateToken, authorizeRoles} from "../middlewares/auth.middlewares"
import { SchedulerController, getAllJadwal } from "../controllers/jadwal.controllers"

const router = express.Router();

const koordinatorController = new KoordinatorController();
const schedulerController = new SchedulerController();
router.post(
    "/koordinator/user",
    // authenticateToken,
    // authorizeRoles(['koordinator']),
    koordinatorController.register,
);

router.get(
    "/koordinator/users",
    authenticateToken,
    authorizeRoles(['koordinator']),
    koordinatorController.getUsers
);

router.get(
    "/koordinator/me",
    authenticateToken,
    authorizeRoles(['koordinator']),
    getCurrentUser
)

router.get(
    "/koordinator/mahasiswa",
    authenticateToken,
    authorizeRoles(['koordinator']),
    koordinatorController.getAllStudentsWithFiles
)

router.get(
    "/koordinator/dokumen/:nim",
    authenticateToken,
    authorizeRoles(['koordinator']),
    koordinatorController.getDokumenByNim
)

router.get(
    "/koordinator/:id/status",
    authenticateToken,
    authorizeRoles(['koordinator']),
    koordinatorController.updateStatus
)

router.post(
    "/koordinator/jadwal",
    authenticateToken,
    authorizeRoles(['koordinator']),
    schedulerController.createJadwal
)

router.get(
    "/koordinator/jadwal",
    // authenticateToken,
    // authorizeRoles(['koordinator']),
    getAllJadwal
)

router.get(
    "/koordinator/jadwal-mahasiswa",
    // authenticateToken,
    // authorizeRoles(['koordinator']),
    schedulerController.getMahasiswa
)

router.get(
    "/koordinator/check-dosen-availability",
    // authenticateToken,
    // authorizeRoles(['koordinator']),
    schedulerController.checkDosenAvailability
)

router.get(
    "/koordinator/dosen-penguji",
    // authenticateToken,
    // authorizeRoles(['koordinator']),
    schedulerController.getDosenPenguji
)

export default router;