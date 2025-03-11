const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Get all users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Create a user
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await prisma.user.create({
    data: { name, email, password },
  });
  res.json(user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
