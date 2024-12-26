import express, { Request, Response } from 'express';
import { AuthController } from "../controllers/auth.controllers";
import {authenticateToken} from "../middlewares/auth.middlewares";

const router = express.Router();
const authController = new AuthController();
router.post("/register", authController.register);
router.post("/login", authController.login);

router.get('/verify', authenticateToken, (req, res) => {
    try {
        // req.user sudah terisi dari middleware authenticateToken
        return res.json({
            valid: true,
            email: req.user?.email,
            roles: req.user?.roles
        });
    } catch (error) {
        return res.status(400).json({
            valid: false,
            message: 'Token verification failed'
        });
    }
});

export default router;