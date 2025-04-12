import express from "express";
import { registerUser } from "../services/auth/registerService";
import { loginUser } from "../services/auth/loginService";
import { Prisma } from "@prisma/client";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Attempting to register user:", { name, email });
    const user = await registerUser(name, email, password);
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
    const { token, user } = await loginUser(email, password);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: "Sai email hoặc mật khẩu" });
  }
});

export default router;
