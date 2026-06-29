import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { getCart, addCartItem, updateCartItem, deleteCartItem, applyPromoCode } from '../controllers/cartController';

const router = Router();

router.use(authenticateJWT);

router.get('/', getCart);
router.post('/items', addCartItem);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', deleteCartItem);
router.post('/apply-promo', applyPromoCode);

export default router;
