import { Router } from "express";
import { User } from "../../modules/users/user.model.js";
import { supabase } from "../../config/supabase.js";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../modules/users/users.controller.js";

export const router = Router();

//MongoDB routes (/api/v2/users)
// const userResponse = (doc) => {
//   const user = doc.toObject();
//   //only delete in Server not DB
//   delete user.password;
//   return user;
// };

router.get("/", getUsers);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

//Supabase/PostgreSQL routes (/api/v2/users/pg)
//Password is excluded from SELECT
// const PG_SELECT = "id, username, email, role, created_at, updated_at";

// router.get("/pg", async (req, res) => {
//   try {
//     const users = await User.find();
//     return res.status(200).json({ success: true, data: users });
//   } catch (error) {
//     return res.status(400).json({ success: false, error: error });
//   }
// });

// router.post("/pg", async (req, res) => {
//   const { username, email, password, role } = req.body || {};

//   if (!username || !email || !password) {
//     return res.status(400).json({
//       success: false,
//       error: "username, email, and password are required",
//     });
//   }

//   try {
//     const { data, error } = await supabase
//       .from("users")
//       .insert({ username, email, password, role: role || "user" })
//       .select(PG_SELECT)
//       .single();

//     if (error) throw error;
//     return res.status(201).json({ success: true, data });
//   } catch (err) {
//     return res.status(400).json({ success: false, error: err.message });
//   }
// });

// router.put("/pg/:id", async (req, res) => {});

// router.delete("/pg/:id", async (req, res) => {});
