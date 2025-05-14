import express from "express";
import { registerUser } from "../services/auth/registerService";
import { loginUser } from "../services/auth/loginService";
import { Prisma } from "@prisma/client";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const user = await registerUser(name, email, password, phone, address, role);
    console.log("User registered successfully:", user);
    res.json(user);
  } catch (error) {
    console.error("Registration error details:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: "Email already exists" });
      }
    }
    
    res.status(500).json({ 
      error: "Registration failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Attempting to login user:", { email });
    const { token, user } = await loginUser(email, password);
    console.log("User logged in successfully:", { id: user.id, email: user.email, role: user.role });
    
    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(401).json({ error: "User not found" });
      }
      if (error.message === "Invalid password") {
        return res.status(401).json({ error: "Invalid password" });
      }
    }
    res.status(500).json({ error: "Login failed", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

export default router;
