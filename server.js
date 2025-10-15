import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './src/api/users.js';
import healthRouter from './src/api/health.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/health', healthRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
