import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './src/routes/auth.route.js';
import taskRouter from './src/routes/task.route.js';
import { authMiddleware } from './src/middlewares/auth.middleware.js';
import { roleBaseAuth } from './src/middlewares/roleCheck.middleware.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigin = [
    process.env.FRONTEND_PATH,
    'http://localhost:3000',
    'http://localhost:5173'
].filter(Boolean);

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));
app.use(cookieParser());

app.use('/health', (req, res) => {
    res.status(200).json({ status: true, message: "Server is healthy" })
});

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/task', authMiddleware, taskRouter);

// Global error handling
app.use((error, req, res, next) => {

    const isProduction = process.env.NODE_ENV == 'production';

    const statusCode = error.status || 500;

    return res
        .status(statusCode)
        .json({
            status: statusCode,
            message: error.message || "Internal Server Error",
            error: isProduction ? null : error.message,
        });
})

export default app;