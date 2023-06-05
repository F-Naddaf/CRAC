import express from "express";
import {
  register,
  login,
  loginWithGoogle,
  authenticateToken,
  getUser,
  getUserById,
  addUserPhone,
  verifyCode,
  addToFriends,
  addToFavorite,
  getFriendDetails,
  deleteFriend,
} from "../controllers/user.js";
const userRouter = express.Router();

userRouter.get("/", authenticateToken, getUser);
userRouter.get("/:id", authenticateToken, getUserById);
userRouter.get("/friendDetails/:userId", getFriendDetails);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/phone", authenticateToken, addUserPhone);
userRouter.post("/phone/verify", authenticateToken, verifyCode);
userRouter.post("/:id/addFriend", addToFriends);
userRouter.post("/:id/favorite", addToFavorite);
userRouter.delete("/:userId/friends/:friendId", deleteFriend);

export default userRouter;
