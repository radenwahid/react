import express from 'express';
import cors from 'cors';
import UserRoutes from "./routes/UserRoutes.js";
import db from './config/database.js';
import LoginRouter from "./routes/LoginRouter.js";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // This should be before routes that use cookies
app.use(UserRoutes);
app.use(LoginRouter);

try {
    await db.authenticate();
    console.log('Database connection successful.');
} catch (error) {
    console.error('Database connection failed:', error);
}

app.listen(5000, () => console.log('Server running on port 5000'));
