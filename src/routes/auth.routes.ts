import express from "express";
import { postAkun } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/user", postAkun);

export default router;
