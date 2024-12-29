import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controllers';
import {authenticateToken} from "../middlewares/auth.middlewares";

const router = Router();
const profileController = new ProfileController();

router.get(
    '/profile',
    authenticateToken,
    profileController.getProfile
);
router.put(
    '/profile',
    authenticateToken,
    profileController.updateProfile
);

export default router;