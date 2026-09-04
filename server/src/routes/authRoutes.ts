import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRegisterInput, validateLoginInput } from '../validators/authValidator';
import { authMiddleware } from '../middleware/authMiddleware';
import { authRateLimiter } from '../middleware/rateLimitMiddleware';

const router = Router();

// POST /api/auth/register — Register new account
router.post('/register', authRateLimiter(), validateRegisterInput, AuthController.register);

// POST /api/auth/login — User login
router.post('/login', authRateLimiter(), validateLoginInput, AuthController.login);

// GET /api/auth/me — Get authenticated user details
router.get('/me', authMiddleware, AuthController.getMe);

export default router;
