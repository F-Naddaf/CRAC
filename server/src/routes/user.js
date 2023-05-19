import express from "express";
import {
  register,
  login,
  loginWithGoogle,
  authenticateToken,
  getUser,
  addUserPhone,
  verifyCode,
} from "../controllers/user.js";
const userRouter = express.Router();

userRouter.get("/", authenticateToken, getUser);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/phone", authenticateToken, addUserPhone);
userRouter.post("/phone/verify", authenticateToken, verifyCode);

export default userRouter;
