import mongoose from "mongoose";

export const musicSchema = new mongoose.Schema({
  title: String,
  url: String,
  singerName: String,
  image: String,
});

export const Music = mongoose.model("Music", musicSchema);
