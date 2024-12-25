import express from 'express';
import {KoordinatorController} from "../controllers/koordinator.controllers"
import { validateCreateUser } from "../middlewares/validation.middlewares";

const router = express.Router();

const koordinatorController = new KoordinatorController();
router.post(
    "/koordinator/user",
    koordinatorController.register,
);

// router.get(
//     "/koordinator/users",
//     getAllUsers
// );
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