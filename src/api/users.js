import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../db/index.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required." });

    const hashed = await bcrypt.hash(password, 10);

    if (process.env.DB_TYPE === "supabase") {
      const { data, error } = await db
        .from("users")
        .insert([{
          Id: crypto.randomUUID(),
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

      console.log("User inserted:", data[0]);
      return res.status(201).json({ message: "User registered successfully", user: data[0] });
    } else {
      return res.status(500).json({ error: "Unsupported DB type" });
    }

  } catch (err) {
    console.error("Signup route error:", err);
    return res.status(500).json({ error: "Failed to register user" });
  }
});

export default router;
