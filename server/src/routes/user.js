import express from "express";
import {
  register,
  login,
  logout,
  loginWithGoogle,
  authenticateToken,
  getUser,
  getActiveUsers,
  getUserById,
  addUserPhone,
  verifyCode,
  addToFriends,
  addToFavorite,
  getFriendDetails,
  getFollowersDetail,
  addSavedVideos,
  updateUser,
  deleteFriend,
} from "../controllers/user.js";
const userRouter = express.Router();

userRouter.get("/", authenticateToken, getUser);
userRouter.get("/active", getActiveUsers);
userRouter.get("/:id", authenticateToken, getUserById);
userRouter.get("/friendDetails/:userId", getFriendDetails);
userRouter.get("/followersDetail/:userId", getFollowersDetail);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.patch("/:id/logout", logout);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/phone", authenticateToken, addUserPhone);
userRouter.post("/phone/verify", authenticateToken, verifyCode);
userRouter.post("/:id/addFriend", addToFriends);
userRouter.post("/:id/favorite", addToFavorite);
userRouter.post("/:id/save", addSavedVideos);
userRouter.patch("/:id/updateUser", updateUser);
userRouter.delete("/:userId/friends/:friendId", deleteFriend);

export default userRouter;
