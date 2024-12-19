import express, { Request, Response } from 'express';
import { registerController, loginController, validateTokenController } from "../controllers/auth.controllers";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/validate-token", validateTokenController);

export default router;