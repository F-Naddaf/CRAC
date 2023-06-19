import mongoose from "mongoose";

export const mediaSchema = new mongoose.Schema({
  title: String,
  url: String,
  posted: Boolean,
  userId: String,
  userImage: String,
  username: String,
  favorite: Number,
  amountOfComments: Number,
  comments: [
    {
      videoId: String,
      userId: String,
      userImage: String,
      username: String,
      comment: String,
      likes: [{ userId: String }],
      unlikes: [{ userId: String }],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const Videos = mongoose.model("Videos", mediaSchema);
