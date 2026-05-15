import { Router } from "express";
import { router as userRouter } from "./users.routes.js";

export const router = Router();

router.use("/users", userRouter);

//router.use("/products", productRouter);

//router.use("/notes", notesRouter);
