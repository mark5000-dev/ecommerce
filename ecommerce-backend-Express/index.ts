import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './src/routes/user';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);

app.get('/health',(req,res)=>{
    res.status(200).json({status: 'UP', runtime: 'bunx'});
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


