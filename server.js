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
  : []; // empty array → allow all origins
console.log("Allowed frontend origins:", FRONTEND_ORIGINS);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
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

// ✅ Serve frontend if FRONTEND_BUILD_DIR is set
if (process.env.FRONTEND_BUILD_DIR) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const frontendDir = path.resolve(__dirname, process.env.FRONTEND_BUILD_DIR);

  // Serve static files
  app.use(express.static(frontendDir));

  // Catch-all: serve home.html for all frontend routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDir, 'Home.html'));
  });
}

// ✅ Optional root route if frontend is not served
if (!process.env.FRONTEND_BUILD_DIR) {
  app.get('/', (req, res) => res.send('Backend is running!'));
}

// ✅ Catch-all for unknown API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
