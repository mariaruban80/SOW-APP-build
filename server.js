import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import usersRouter from './src/api/users.js';
import healthRouter from './src/api/health.js';

dotenv.config();

const app = express();

// Fix for ES modules (to get __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/users', usersRouter);
app.use('/api/health', healthRouter);

// Default route — serve Home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});

// Catch-all for unknown routes (optional, e.g. SPA)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'Home.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

