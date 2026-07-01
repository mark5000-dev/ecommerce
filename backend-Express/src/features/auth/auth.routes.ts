import { Router } from 'express';
import { authenticateJWT } from '../../core/middlewares/auth';
import { register, login, logout } from './auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateJWT, logout);

export default router;