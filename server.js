import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './src/api/users.js';
import healthRouter from './src/api/health.js';

dotenv.config();

const app = express();

// ✅ Allow your frontend domain(s)
app.use(cors({
  origin: [
    "https://sow-app-frontend.onrender.com", // your deployed frontend
    "http://localhost:4000",                 // local dev if needed
    "http://127.0.0.1:4000"
  ],
  methods: ["GET", "POST"],
}));

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/health', healthRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
