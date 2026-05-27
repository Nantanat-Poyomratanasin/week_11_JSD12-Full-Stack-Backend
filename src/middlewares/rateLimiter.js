const rateLimit = require("express-rate-limiter"); //middlewareที่จำกัด req number เวลามีคนยิงreqมาเยอะๆ

export const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ในเเวลา 15 mins
  max: 100, // limit each IP to 100 requests (ถ้ามีคนติดต่อเกิน 100 รอบ ใน 15 mins window จะ limit รอบที่ 101 จนกว่าจะรีเซ็ตเวลาใหม่)
  standardHeaders: true,
  legacyHeaders: false,
});
