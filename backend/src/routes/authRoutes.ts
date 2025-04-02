import express from "express";
import { registerUser } from "../services/auth/registerService";
import { loginUser } from "../services/auth/loginService";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.json(user);
  } catch (error) {
    console.error("Lỗi đăng ký:", error); 
    res.status(500).json({ error: "Lỗi khi đăng ký" });
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
