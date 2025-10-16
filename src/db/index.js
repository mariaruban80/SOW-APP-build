// src/db/index.js
import { createClient } from '@supabase/supabase-js';
import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

let db;

if (process.env.DB_TYPE === 'supabase') {
  db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  console.log("✅ Connected to Supabase");
} else if (process.env.DB_TYPE === 'oracle') {
  db = await oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASS,
    connectString: process.env.ORACLE_CONN
  });
  console.log("✅ Connected to Oracle");
}

export default db;
