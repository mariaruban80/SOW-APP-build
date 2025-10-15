import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (process.env.DB_TYPE === 'supabase') {
      const { data, error } = await db.from('users').select('*');
      if (error) throw error;
      res.json(data);
    } else if (process.env.DB_TYPE === 'oracle') {
      const result = await db.execute(`SELECT * FROM users`);
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
