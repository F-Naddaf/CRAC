import mongoose from "mongoose";
import { Videos } from "../models/Media.js";

export const getAllMedia = async (req, res) => {
  try {
    const videos = await Videos.find({ posted: true });
    const reversedVideos = videos.reverse();
    res.status(200).json({ success: true, videos: reversedVideos });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch videos." });
  }
};

export const getUserMedia = async (req, res) => {
  const userId = req.params.userId;
  try {
    const videos = await Videos.find({ userId: userId });
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch videos." });
  }
};

export const postVideo = async (req, res) => {
  const { media, userId, userImage, username } = req.body;
  try {
    let newVideo;
    const existingVideo = await Videos.findOne({ url: media.url });

    if (existingVideo) {
      if (media.posted) {
        if (!media.title || media.title.trim() === "") {
          return res
            .status(400)
            .json({ success: false, message: "Title is required" });
        }
        await Videos.findByIdAndUpdate(existingVideo._id, {
          $set: {
            title: media.title,
            posted: media.posted,
            userId: userId,
            userImage: userImage,
            username: username,
          },
        });
      }
    } else {
      if (!media.title || media.title.trim() === "") {
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      }
      newVideo = await Videos.create({
        title: media.title,
        url: media.url,
        posted: media.posted,
        userId: userId,
        userImage: userImage,
        username: username,
      });
    }
    res.status(200).json({
      success: true,
      message: "Video saved successfully",
      newVideo: newVideo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error." });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const videoId = new mongoose.Types.ObjectId(id);
    const deletedVideo = await Videos.findByIdAndDelete(videoId);
    if (!deletedVideo) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
      deletedVideo: deletedVideo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error." });
  }
};

export const postLater = async (req, res) => {
  const { media, userId, userImage, username } = req.body;
  try {
    const newVideo = await Videos.create({
      url: media.url,
      posted: media.posted,
      userId: userId,
      userImage: userImage,
      username: username,
    });
    res.status(200).json({
      success: true,
      message: "Video saved successfully",
      newVideo: newVideo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Error." });
  }
};

// Get all the videos with same title
export const getMediaByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const regex = new RegExp(title, "i");
    const videos = await Videos.find({
      title: { $regex: regex },
      posted: true,
    });
    const reversedVideos = videos.reverse();
    res.status(200).json({ success: true, videos: reversedVideos });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch videos." });
  }
};

// Get a video by ID
export const getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Videos.findById(id);
    res.status(200).json({ video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve video" });
  }
};

// Adding a comment
export const addComment = async (req, res) => {
  try {
    const { videoId, userId, userImage, username, comment } = req.body;
    const video = await Videos.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const newComment = {
      videoId,
      userId,
      userImage,
      username,
      comment,
    };
    video.comments.push(newComment);
    await video.save();
    res.status(200).json({
      success: true,
      message: "Post added successfully",
      comment: newComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add post", error: error.message });
  }
};
