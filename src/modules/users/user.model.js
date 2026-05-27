// import mongoose from "mongoose";
// import { time } from "node:console";
// import bcrypt from "bcrypt";

// //Schema สร้างโครง data ที่เป็นแผนผัง
// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: { type: String, enum: ["admin", "user"], default: "user" },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//       select: false,
//     },
//   },
//   { timestamps: true },
// );

// //Hash password before saving in DB (best practice)
// //.pre ก่อน query DB ให้ hash ก่อน
// userSchema.pre("save", async function () {
//   //ดักว่าถ้าไม่เปลี่ยน pw ก็ไม่ต้อง hash
//   if (!this.isModified("password")) return;

//   this.password = await bcrypt.hash(this.password, 14);
// });

// //Model คือสร้างโครงของจริงขึ้นมา รับ parameter เป็นชื่อ model (ชื่อ model เป็น usesr เพราะสร้างของแต่ละ user คนเดียว) และ ชื่อschema
// export const User = mongoose.model("user", userSchema);

///////P'Niti code
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 72,
      select: false,
    },
    embedding: {
      status: {
        type: String,
        enum: ["PENDING", "PROCESSING", "READY", "FAILED"],
        default: "PENDING",
      },
      dims: { type: Number, default: 3072 },
      vector: { type: [Number], select: false },
      attempts: { type: Number, default: 0 },
      lastAttemptAt: { type: Date, default: null },
      updatedAt: { type: Date, default: null },
      lastError: { type: String, default: null },
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export const User = mongoose.model("User", userSchema);
