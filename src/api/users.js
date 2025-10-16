import express from "express";
import bcrypt from "bcrypt";
import db from "../db/index.js";

const router = express.Router();

// Create user (signup)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required." });

    // Hash password before storing
    const hashed = await bcrypt.hash(password, 10);

    if (process.env.DB_TYPE === "supabase") {
      const { data, error } = await db
        .from("users")
        .insert([{ name, email, password: hashed }])
        .select();

      if (error) throw error;
      res.status(201).json({ message: "User registered successfully", user: data[0] });
    } else {
      res.status(500).json({ error: "Unsupported DB type" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

export default router;
