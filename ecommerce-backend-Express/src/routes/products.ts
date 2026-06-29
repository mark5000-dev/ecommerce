import { Router } from 'express';
import { listProducts, getProductById, getProductReviews, addProductReview } from '../controllers/productController';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', addProductReview);

export default router;
