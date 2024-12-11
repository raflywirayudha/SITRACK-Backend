import { Router, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middlewares';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Add debug route to check token
router.get('/debug-token', authenticateToken, (req: Request, res: Response) => {
    res.json({
        message: 'Token is valid',
        user: req.user
    });
});

// Protected route example
router.get(
    '/mahasiswa-only',
    authenticateToken,
    authorizeRoles([Role.mahasiswa]),
    (req: Request, res: Response) => {
        try {
            console.log('Access granted for user:', req.user); // Debug log
            res.json({
                message: 'Mahasiswa access granted',
                user: req.user
            });
        } catch (error) {
            console.error('Route Handler Error:', error); // Debug log
            res.status(500).json({
                status: 'error',
                message: 'Error in route handler'
            });
        }
    }
);

router.get(
    '/dosen-pembimbing-only',
    authenticateToken,
    authorizeRoles([Role.dosen_pembimbing]),
    (req: Request, res: Response) => {
        try {
            console.log('Access granted for user:', req.user); // Debug log
            res.json({
                message: 'Dosen access granted',
                user: req.user
            });
        } catch (error) {
            console.error('Route Handler Error:', error); // Debug log
            res.status(500).json({
                status: 'error',
                message: 'Error in route handler'
            });
        }
    }
);

router.get(
    '/dosen-penguji-only',
    authenticateToken,
    authorizeRoles([Role.dosen_penguji]),
    (req: Request, res: Response) => {
        try {
            console.log('Access granted for user:', req.user); // Debug log
            res.json({
                message: 'Dosen access granted',
                user: req.user
            });
        } catch (error) {
            console.error('Route Handler Error:', error); // Debug log
            res.status(500).json({
                status: 'error',
                message: 'Error in route handler'
            });
        }
    }
);

router.get(
    '/kaprodi-only',
    authenticateToken,
    authorizeRoles([Role.kaprodi]),
    (req: Request, res: Response) => {
        try {
            console.log('Access granted for user:', req.user); // Debug log
            res.json({
                message: 'Kaprodi access granted',
                user: req.user
            });
        } catch (error) {
            console.error('Route Handler Error:', error); // Debug log
            res.status(500).json({
                status: 'error',
                message: 'Error in route handler'
            });
        }
    }
);

router.get(
    '/pembimbing-instansi-only',
    authenticateToken,
    authorizeRoles([Role.pembimbing_instansi]),
    (req: Request, res: Response) => {
        try {
            console.log('Access granted for user:', req.user); // Debug log
            res.json({
                message: 'Pembimbing Instansi access granted',
                user: req.user
            });
        } catch (error) {
            console.error('Route Handler Error:', error); // Debug log
            res.status(500).json({
                status: 'error',
                message: 'Error in route handler'
            });
        }
    }
);

router.get(
    '/koordinator-kp-only',
    authenticateToken,
    authorizeRoles([Role.koordinator_kp]),
    (req: Request, res: Response) => {
        try {
            console.log('Access granted for user:', req.user); // Debug log
            res.json({
                message: 'Koordinator KP access granted',
                user: req.user
            });
        } catch (error) {
            console.error('Route Handler Error:', error); // Debug log
            res.status(500).json({
                status: 'error',
                message: 'Error in route handler'
            });
        }
    }
);

export default router;