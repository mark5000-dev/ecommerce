import { Router } from 'express';
import { subscribeNewsletter } from './newsletter.controller';

const router = Router();

router.post('/subscribe', subscribeNewsletter);

export default router;
