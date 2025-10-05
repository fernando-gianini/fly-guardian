import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.fg.js';

const router = Router();

router.get('/health', getHealth);

export default router;

