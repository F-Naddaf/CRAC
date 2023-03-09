import express from "express";
import { getUserPhone, verifyCode } from "../controllers/user.js"
const userRouter = express.Router();

userRouter.post("/phone", getUserPhone);
userRouter.post("/verify", verifyCode);

export default userRouter