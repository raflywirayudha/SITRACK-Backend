import express from "express";
import accessTokenValidation from "../middlewares/auth.middlewares.js";
import {
    postDocument,
    getDocuments,
    updateDocument
} from "../controllers/mahasiswa.controllers.js";
import {
    uploadPersyaratan,
    uploadPendaftaran,
    uploadPascaSeminar
} from "../middlewares/upload.middlewares";
import {authorizeRoles} from "../middlewares/protected.middlewares.js";

const router = express.Router();

// Persyaratan Routes
router.post(
    "/mahasiswa/persyaratan/upload",
    uploadPersyaratan.single("file"),
    // accessTokenValidation,
    // authorizeRoles("mahasiswa"),
    (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({error: "No file uploaded"})
        }
        postDocument(req, res, "Persyaratan")
    }
);
router.get(
    "/mahasiswa/persyaratan",
    // accessTokenValidation,
    // authorizeRoles("mahasiswa"),
    (req, res) =>
        getDocuments(req, res, "Persyaratan")
);
router.patch(
    "/mahasiswa/persyaratan/:id",
    // accessTokenValidation,
    // authorizeRoles("mahasiswa"),
    (req, res) =>
        updateDocument(req, res, "Persyaratan")
);

// Pendaftaran Routes
router.post('/mahasiswa/pendaftaran/upload',
    uploadPendaftaran.single('file'),
    // accessTokenValidation,
    // authorizeRoles("mahasiswa"),
    (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({error: "No file uploaded"})
        }
        postDocument(req, res, "Pendaftaran")
    }
)
router.get('/mahasiswa/pendaftaran',
    // accessTokenValidation,
    // authorizeRoles("mahasiswa"),
    (req, res) =>
        getDocuments(req, res, 'Pendaftaran')
)
router.patch('/mahasiswa/pendaftaran/:id',
    // accessTokenValidation,
    // authorizeRoles("mahasiswa"),
    (req, res) =>
        updateDocument(req, res, 'Pendaftaran')
)

// Pasca Seminar Routes
router.post('/mahasiswa/pasca-seminar/upload',
    uploadPascaSeminar.single('file'),
    // accessTokenValidation,
    // authorizeRoles("mahasiswa"),
    (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({error: "No file uploaded"})
        }
        postDocument(req, res, "PascaSeminar")
    }
)
router.get('/mahasiswa/pasca-seminar',
    // accessTokenValidation,
    // authorizeRoles("mahasiswa"),
    (req, res) =>
        getDocuments(req, res, 'PascaSeminar')
)
router.patch('/mahasiswa/pasca-seminar/:id',
    // accessTokenValidation,
    // authorizeRoles("mahasiswa"),
    (req, res) =>
        updateDocument(req, res, 'PascaSeminar')
);

export default router;