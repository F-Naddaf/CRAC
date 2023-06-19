import mongoose from "mongoose";

export const mediaSchema = new mongoose.Schema({
  title: String,
  url: String,
  posted: Boolean,
  userId: String,
  userImage: String,
  username: String,
  favorite: { type: Number, default: 0 },
  amountOfComments: { type: Number, default: 0 },
  saved: { type: Number, default: 0 },
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
