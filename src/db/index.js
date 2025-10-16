import { createClient } from '@supabase/supabase-js';
import knex from 'knex';
import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

let db;

if (process.env.DB_TYPE === "supabase") {
  const { data, error } = await db
    .from("users")
    .insert([{
      Id: crypto.randomUUID(),    // generate a unique Id
      name,
      email,
      password: hashed,
      role: "user",               // default role
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ error: "Supabase insert failed: " + error.message });
  }

  console.log("User inserted:", data[0]);
  res.status(201).json({ message: "User registered successfully", user: data[0] });
}

//if (process.env.DB_TYPE === 'supabase') {
 // db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  //console.log("✅ Connected to Supabase");
//} 
else if (process.env.DB_TYPE === 'oracle') {
  db = await oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASS,
    connectString: process.env.ORACLE_CONN
  });
  console.log("✅ Connected to Oracle");
}

export default db;
