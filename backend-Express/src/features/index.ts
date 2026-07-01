import { Router } from 'express';
import authRouter from './auth/auth.routes';
import productRouter from './products/product.routes';
import categoryRouter from './categories/category.routes';
import newsLetterRouter from './newsletter/newsletter.routes';
import orderRouter from './orders/order.routes';
import userRouter from './users/user.routes';
import cartRouter from './cart/cart.routes';
import wishlistRouter from './wishlist/wishlist.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/wishlist', wishlistRouter);
apiRouter.use('/newsletter', newsLetterRouter);


export default apiRouter;