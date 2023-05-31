import express from "express";
import {
  register,
  login,
  loginWithGoogle,
  authenticateToken,
  getUser,
  addUserPhone,
  verifyCode,
  postVideo,
  addToFavorite,
} from "../controllers/user.js";
const userRouter = express.Router();

userRouter.get("/", authenticateToken, getUser);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/phone", authenticateToken, addUserPhone);
userRouter.post("/phone/verify", authenticateToken, verifyCode);
userRouter.post("/postVideo", postVideo);
userRouter.post("/:id/favorite", addToFavorite);

export default userRouter;
