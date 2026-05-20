import { Router } from "express";
import { User } from "../../modules/users/user.model.js";
import { supabase } from "../../config/supabase.js";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  createUserHash,
  usersLogin,
} from "../../modules/users/users.v2.controller.js";

export const router = Router();

//##MongoDB routes (/api/v2/users)

// const userResponse = (doc) => {
//   const user = doc.toObject();
//   //only delete in Server not DB
//   delete user.password;
//   return user;
// };

// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     return res.status(200).json({ success: true, data: users });
//   } catch (error) {
//     return res.status(400).json({ success: false, error: error });
//   }
// });

// router.post("/", async (req, res) => {
//   const { username, email, password, role } = req.body || {};

//   if (!username || !email || !password) {
//     const err = new Error("Username, email, and password are required");
//     err.name = "ValidationError";
//     err.status = 400;
//     return res.status(400).json({ success: false, error: err });
//   }

//   try {
//     const doc = await User.create({ username, email, password, role });
//     return res.status(201).json({ success: true, data: userResponse(doc) });
//   } catch (err) {
//     return res.status(400).json({ success: false, error: err });
//   }
// });

// router.put("/:id", async (req, res) => {
//   const { username, email, password, role } = req.body || {};
//   const updates = {};

//   if (username !== undefined) updates.username = username;
//   if (email !== undefined) updates.email = email;
//   if (password !== undefined) updates.password = password;
//   if (role !== undefined) updates.role = role;

//   if (Object.keys(updates).length === 0) {
//     return res.status(400).json({
//       success: false,
//       error: "At least one field is required to update",
//     });
//   }

//   try {
//     const doc = await User.findByIdAndUpdate(req.params.id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!doc) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }

//     return res.status(200).json({ success: true, data: doc });
//   } catch (err) {
//     return res.status(400).json({ success: false, error: err });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const doc = await User.findByIdAndDelete(req.params.id);
//     if (!doc) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }
//     return res.status(200).json({ success: true, data: doc });
//   } catch (err) {
//     return res.status(400).json({ success: false, error: err });
//   }
// });

//##use controller

router.get("/", getUsers);

// router.post("/", createUser);

router.post("/", createUserHash);

router.post("/login", usersLogin);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

//##Supabase/PostgreSQL routes (/api/v2/users/pg)
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
