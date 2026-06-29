import { Router } from 'express';
import authRouter from './auth/auth.routes';
import productRouter from './products/product.routes';
import categoryRouter from './categories/category.routes';
import newsLetterRouter from './newsletter/newsletter.routes';
import orderRouter from './orders/order.routes';
import userRouter from './users/users.routes';
import cartRouter from './cart/cart.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/order', orderRouter);
apiRouter.use('/newsletter', newsLetterRouter);


export default apiRouter;