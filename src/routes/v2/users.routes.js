import { Router } from "express";
import { bcrypt } from "bcrypt";
import jwt from "jsonwebtoken";

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
import { authUser } from "../../middlewares/auth.js";

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

//read all users
router.get("/", getUsers);

//Create a user
router.post("/", createUser);

//Update a user
router.put("/:id", updateUser);

//Delete a usesr
router.delete("/:id", deleteUser);

//##############################not use JWT#################################################

// router.post("/", createUserHash);

// router.post("/login", usersLogin);

//############################## JWT ###########################################################
//Login a user
router.post("/login", async (req, res, next) => {
  //เอา email and password ออกจาก req.body
  const { email, password } = req.body;

  //checkว่าข้อมูลที่ได้รับมาถูกต้องมั้ย
  if (!emaill || !password) {
    //ส่งข้อมูลกลับไป
    return res
      .status(400)
      .json({ success: false, message: "Email and Password required!" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: "incorrect password!" });
    }
    //ok -->  แจก token
    //ใส่ 3  parameter คือ user id, secret key ใน .env,เวลาหมดอายุของtoken
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); //1 hrs expiration

    const isProd = process.env.NODE_ENV === "production";

    //เก็บ token ใน cookie
    //ใส่ 3 paremeter --> ชื่อที่ๆเราจะไปเก็บใน cookie, ตัวแปร token, config
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd, //only send over HTTPS in production
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1hr
    });

    return res.status(200).json({
      success: true,
      message: "login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

//Check user session/token
router.get("/auth/me", authUser, async (req, res, next) => {
  try {
    const userId = req.user.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

//Log out --> delete token in cookie
router.post("/auth/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd, //only send over HTTPS in production
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

//###############Supabase/PostgreSQL routes (/api/v2/users/pg)###########################
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
