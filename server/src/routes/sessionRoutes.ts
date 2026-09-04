import { Router } from 'express';
import { SessionController } from '../controllers/sessionController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateCreateSession, validateSubmitAnswer } from '../validators/sessionValidator';

const router = Router();

// Require authentication for all game session operations
router.use(authMiddleware);

// POST /api/game-sessions — Start new game session
router.post('/', validateCreateSession, SessionController.createSession);

// GET /api/game-sessions/history — Fetch session history for current user
router.get('/history', SessionController.getSessionHistory);

// GET /api/game-sessions/:id — Retrieve single session metadata and questions
router.get('/:id', SessionController.getSessionById);

// POST /api/game-sessions/:id/answers — Submit an answer for a question
router.post('/:id/answers', validateSubmitAnswer, SessionController.submitAnswer);

// POST /api/game-sessions/:id/complete — Finalize session and calculate server-side result
router.post('/:id/complete', SessionController.completeSession);

export default router;
