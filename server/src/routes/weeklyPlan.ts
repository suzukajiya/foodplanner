import { Router } from 'express';
import { generatePlan, savePlan, getCurrentPlan, resetCurrentPlan } from '../controllers/weeklyPlanController';

const router = Router();

router.post('/generate', generatePlan);
router.post('/save', savePlan);
router.get('/current', getCurrentPlan);
router.delete('/current', resetCurrentPlan);

export default router;
