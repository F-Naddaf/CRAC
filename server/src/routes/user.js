import express from "express";
import {
  addUserPhone,
  login,
  loginWithGoogle,
  register,
  verifyCode,
} from "../controllers/user.js";
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/phone", addUserPhone);
userRouter.post("/phone/verify", verifyCode);

export default userRouter;
