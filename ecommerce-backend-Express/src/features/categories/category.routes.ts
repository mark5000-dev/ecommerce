import { Router } from 'express';
import { listCategories, getCategoryById, getCategoryProducts } from './category.controller';

const router = Router();

router.get('/', listCategories);
router.get('/:id', getCategoryById);
router.get('/:id/products', getCategoryProducts);

export default router;
