import express from "express";
import {
  register,
  login,
  loginWithGoogle,
  authenticateToken,
  getUser,
  addUserPhone,
  verifyCode,
  addMedia,
} from "../controllers/user.js";
const userRouter = express.Router();

userRouter.get("/", authenticateToken, getUser);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/phone", authenticateToken, addUserPhone);
userRouter.post("/phone/verify", authenticateToken, verifyCode);
userRouter.patch("/media", authenticateToken, addMedia);

export default userRouter;
