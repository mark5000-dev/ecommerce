import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { listOrders, getOrderById, createOrder, cancelOrder } from '../controllers/orderController';

const router = Router();

router.use(authenticateJWT);

router.get('/', listOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id/cancel', cancelOrder);

export default router;
