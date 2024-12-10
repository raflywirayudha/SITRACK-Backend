import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares.js";
import {authorizeRoles} from "../middlewares/protected.middlewares.js";
import { DokumenController } from "../controllers/koordinator.controllers";

const router = express.Router();
const dokumenController = new DokumenController();

router.post('/koordinator/dokumen', dokumenController.uploadDokumen);
router.get('/koordinator/dokumen/:nim', dokumenController.getDokumenByNim);
router.put('/koordinator/dokumen/:id', dokumenController.updateStatusDokumen);
router.delete('/koordinator/dokumen/:id', dokumenController.deleteDokumen);


export default router;