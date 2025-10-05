import { Router } from 'express';
import {
  register,
  login,
  refresh,
  resetPassword,
} from '../controllers/auth.controller.fg.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/reset-password', resetPassword);

export default router;
