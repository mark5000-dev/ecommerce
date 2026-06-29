import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { register, login, getCurrentUser, logout } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJWT, getCurrentUser);
router.post('/logout', authenticateJWT, logout);

export default router;
