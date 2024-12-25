import express, { Request, Response } from 'express';
import { AuthController } from "../controllers/auth.controllers";

const router = express.Router();
const authController = new AuthController();
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;