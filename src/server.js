import express from "express";
import cors from "cors";

import { users } from "./mockData/fakeUser.js";
import { router as apiRoutes } from "./routes/index.js";
import { connectDB } from "./config/mongodb.js";

const app = express();

//.use() --> สั่งให้ใช้ middleware สักตัว
app.use(cors());

//.JSON นี้เป็นของ express -->แปลง JSON เป็น JS -->เป็น middleware
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send(`<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Express + Tailwind</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="min-h-screen bg-gray-50 text-gray-800">
      <main class="max-w-2xl mx-auto p-8">
        <div class="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-8">
          <h1 class="text-3xl font-bold tracking-tight text-blue-600">
            Hello Client, I am your Server!
          </h1>
          <p class="mt-3 text-gray-600">
            This page is styled with <span class="font-semibold">Tailwind CSS</span> via CDN.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a href="/api/v2/users" class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              GET /users
            </a>
            <span class="text-xs text-gray-500">Try POST/PUT/DELETE with your API client.</span>
          </div>
        </div>
        <footer class="mt-10 text-center text-xs text-gray-400">
          Express server running with Tailwind via CDN
        </footer>
      </main>
    </body>
  </html>`);
});

//เส้นทางที่ให้userใช้
app.get("/users", (req, res) => {
  // function controller
  //.json --> convert JSON and send
  //.json อันนี้เป็นแค่ method เฉยๆ
  res.json(users);
});

app.post("/users", (req, res) => {
  const { username, email } = req.body || {};
  //ตรวจสอบว่ามี username และ email หรือไม่
  if (!username || !email) {
    //ส่งกลับไปเลย ไม่ทำงานต่อแล้ว
    return res.status(400).json({ error: "Username and email are required" });
  }

  //Simple incremental string id based on current mock data
  const nextId = String(
    users.reduce((max, u) => Math.max(max, Number(u.id)), 0) + 1,
  );
  const newUser = { id: nextId, username: username, email: email };
  users.push(newUser);
  return res.status(201).json(newUser);
});

// //put() ต้องอัพเดททุก field data แต่ patch() อัพเดทบาง field data ได้
app.put("/users/:id", (req, res) => {
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

// app.delete();

const port = 3000;

await connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
