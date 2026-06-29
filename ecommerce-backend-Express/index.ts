import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './src/routes/auth';
import userRouter from './src/routes/users';
import productRouter from './src/routes/products';
import categoryRouter from './src/routes/categories';
import cartRouter from './src/routes/cart';
import wishlistRouter from './src/routes/wishlist';
import orderRouter from './src/routes/orders';
import newsletterRouter from './src/routes/newsletter';

import morgan from 'morgan';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', orderRouter);
app.use('/api/newsletter', newsletterRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', runtime: 'bunx' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


