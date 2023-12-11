import express, { Request, Response } from 'express';
import userRouter from './Users/router';
import cors from 'cors'

const app = express();
const port = 5000;

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use('/users',userRouter)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});