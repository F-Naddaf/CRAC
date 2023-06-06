import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  numberForCheck: Number,
  username: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isActivate: { type: Boolean, default: false },
  userImage: { type: String },
  token: String,
  favoriteVideos: [{ videoId: String, url: String }],
  savedVideos: [{ videoId: String, url: String }],
  friends: [{ userId: String }],
  videoId: String,
});

export const User = mongoose.model("users", userSchema);
