import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../db/index.js";  // your database client
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// POST /api/users/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const hashed = await bcrypt.hash(password, 10);

    if (process.env.DB_TYPE === "supabase") {
      // Supabase insert
      const { data, error } = await db
        .from("users")
        .insert([{
          id: crypto.randomUUID(),       // lowercase 'id' to match Supabase
          name,
          email,
          password: hashed,
          role: "user",
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        return res.status(500).json({ error: "Supabase insert failed: " + error.message });
      }

      console.log("User inserted in Supabase:", data[0]);
      return res.status(201).json({ message: "User registered successfully", user: data[0] });

    } else if (process.env.DB_TYPE === "oracle") {
      // Oracle insert using knex or raw query
      // Assuming `db` is an oracledb connection
      const id = crypto.randomUUID();
      const role = "user";
      const created_at = new Date();

      const sql = `INSERT INTO users (id, name, email, password, role, created_at)
                   VALUES (:id, :name, :email, :password, :role, :created_at)`;

      const binds = { id, name, email, password: hashed, role, created_at };

      try {
        await db.execute(sql, binds, { autoCommit: true });
        console.log("User inserted in Oracle:", { id, name, email });
        return res.status(201).json({
          message: "User registered successfully",
          user: { id, name, email, role, created_at }
        });
      } catch (oracleErr) {
        console.error("Oracle insert error:", oracleErr);
        return res.status(500).json({ error: "Oracle insert failed: " + oracleErr.message });
      }

    } else {
      return res.status(500).json({ error: "Unsupported DB type" });
    }

  } catch (err) {
    console.error("Signup route error:", err);
    return res.status(500).json({ error: "Failed to register user" });
  }
});

export default router;
