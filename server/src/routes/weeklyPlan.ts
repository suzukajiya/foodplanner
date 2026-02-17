import { Router } from 'express';
import { generatePlan, savePlan, getCurrentPlan } from '../controllers/weeklyPlanController';

const router = Router();

router.post('/generate', generatePlan);
router.post('/save', savePlan);
router.get('/current', getCurrentPlan);

export default router;
