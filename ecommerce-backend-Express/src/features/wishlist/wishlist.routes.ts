import { Router } from 'express';
import { authenticateJWT } from '../../core/middlewares/auth';
import { getWishlist, addWishlistItem, deleteWishlistItem } from './wishlist.controller';

const router = Router();

router.use(authenticateJWT);

router.get('/', getWishlist);
router.post('/items', addWishlistItem);
router.delete('/items/:productId', deleteWishlistItem);

export default router;
