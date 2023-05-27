import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  numberForCheck: Number,
  username: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  mediaUrl: [{ title: String, url: String, posted: Boolean }],
  isActivate: { type: Boolean, default: false },
  userImage: String,
  token: String,
  favorite: [{ url: String }],
  // save: [{ url: String }],
});

export const User = mongoose.model("users", userSchema);
