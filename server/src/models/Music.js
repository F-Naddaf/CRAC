import mongoose from "mongoose";

export const musicSchema = new mongoose.Schema({
  title: String,
  url: String,
  singerName: String,
  image: String,
  duration: Number,
});

export const Music = mongoose.model("Music", musicSchema);
