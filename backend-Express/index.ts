import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import apiRouter from './src/features';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);


app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', runtime: 'bunx' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


