import express, { Request, Response } from 'express';
import { AuthController, checkEmail, resetPassword } from "../controllers/auth.controllers";
import {authenticateToken} from "../middlewares/auth.middlewares";

const router = express.Router();
const authController = new AuthController();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/check-email", checkEmail);
router.post("/reset-password", resetPassword);

export default router;