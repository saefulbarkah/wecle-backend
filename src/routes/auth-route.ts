import { Router } from 'express';
import authController from '../controllers/auth/index.js';

const router = Router();

router.post('/login', authController.signIn);
router.post('/register', authController.signUp);
router.post('/logout', authController.signOut);
router.get('/me', authController.Me);
router.post('/verify', authController.verifyUser);

export default router;
