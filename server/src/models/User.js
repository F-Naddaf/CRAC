import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  numberForCheck: Number,
  username: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  mediaUrl: [{ title: String, url: String }],
  isActivate: { type: Boolean, default: false },
  token: String,
});

export const User = mongoose.model("users", userSchema);
