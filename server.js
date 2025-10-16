import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './src/api/users.js';
import healthRouter from './src/api/health.js';

dotenv.config();

const app = express();

// ✅ Dynamic CORS: allow frontend origin(s) from environment variable or allow all
const FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS 
  ? process.env.FRONTEND_ORIGINS.split(',')  // comma-separated list
  : []; // empty array → allow all

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g., Postman or server-to-server)
    if (!origin) return callback(null, true);

    if (FRONTEND_ORIGINS.length === 0 || FRONTEND_ORIGINS.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST"]
}));

app.use(express.json());

// ✅ API routes
app.use('/api/users', usersRouter);
app.use('/api/health', healthRouter);

// ✅ Optional: serve frontend if FRONTEND_BUILD_DIR is set
if (process.env.FRONTEND_BUILD_DIR) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const frontendPath = path.resolve(__dirname, process.env.FRONTEND_BUILD_DIR);
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ✅ Optional root route
app.get('/', (req, res) => res.send('Backend is running!'));

// ✅ Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
