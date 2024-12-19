import express from 'express';
import {getAllUsers, addUser, addJadwal, getJadwal} from "../controllers/koordinator.controllers"
import {authenticateJWT, authorize} from "../middlewares/auth.middlewares"

const router = express.Router();

router.post(
    "/koordinator/user",
    addUser
);

router.get(
    "/koordinator/users",
    getAllUsers
);

router.post(
    "/koordinator/jadwal",
    addJadwal
)

router.get(
    "/koordinator/jadwal",
    getJadwal
)

export default router;