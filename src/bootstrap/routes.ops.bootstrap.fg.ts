import { Router } from 'express';
import coreRoutes from '../routes/index.fg.js';
import authRoutes from '../routes/auth.routes.fg.js';
import droneRoutes from '../routes/drone.routes.fg.js';
import missionRoutes from '../routes/mission.routes.fg.js';

const router = Router();

router.use(coreRoutes);
router.use(authRoutes);
router.use(droneRoutes);
router.use(missionRoutes);

export default router;
