import { Router } from "express";
import { users } from "../../mockData/fakeUser.js";

export const router = Router();

router.get("/", (req, res) => {
  res.json(users);
});

router.post("/", (req, res) => {
  const { username, email } = req.body || {};

  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  const nextId = String(
    users.reduce((max, u) => Math.max(max, Number(u.id), 0) || 0) + 1,
  );

  const newUser = { id: nextId, useername: username, email: emaili };

  users.push(newUsesr);

  return res.status(201).json(newuser);
});

router.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required" });
  }

  user.username = username;
  user.email = email;
  user.password = password;
  res.status(200).json(user);
});
