import mongoose from "mongoose";

export const mediaSchema = new mongoose.Schema({
  title: String,
  url: String,
  posted: Boolean,
  userId: String,
  userImage: String,
  username: String,
  amountOfLike: Number,
});

export const Videos = mongoose.model("Videos", mediaSchema);
