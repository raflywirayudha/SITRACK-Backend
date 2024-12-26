import express from 'express';
import {KoordinatorController, getCurrentUser} from "../controllers/koordinator.controllers"
import {authenticateToken, authorizeRoles} from "../middlewares/auth.middlewares"

const router = express.Router();

const koordinatorController = new KoordinatorController();
router.post(
    "/koordinator/user",
    authenticateToken,
    authorizeRoles(['koordinator']),
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
//
// router.post(
//     "/koordinator/jadwal",
//     addJadwal
// )
//
// router.get(
//     "/koordinator/jadwal",
//     getJadwal
// )

export default router;