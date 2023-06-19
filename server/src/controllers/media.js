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
    const { videoId, userId, userImage, username, comment, createdAt } =
      req.body;
    const video = await Videos.findById(videoId);
    console.log("video", video);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const newComment = {
      videoId,
      userId,
      userImage,
      username,
      comment,
      createdAt,
    };

    video.comments.push(newComment);
    video.amountOfComments += 1;
    await video.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

// Getting all comments of a cuurent video
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Videos.findById(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const comments = video.comments;
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get comments", error: error.message });
  }
};

//Updating the comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { editedComment } = req.body;

    const video = await Videos.findOneAndUpdate(
      { "comments._id": commentId },
      { $set: { "comments.$.comment": editedComment } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json({ success: true, message: "Comment updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Deleting a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { videoId } = req.body;
    const video = await Videos.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const commentIndex = video.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    video.comments.splice(commentIndex, 1);
    video.amountOfComments -= 1;
    await video.save();

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete comment", error: error.message });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { videoId, userId } = req.body;
    const video = await Videos.findById(videoId);
    const comment = video.comments.find((c) => c._id.toString() === commentId);
    const userLikedIndex = comment.likes.findIndex(
      (like) => like.userId === userId
    );

    if (userLikedIndex !== -1) {
      comment.likes.splice(userLikedIndex, 1);
    } else {
      comment.likes.push({ userId });
    }

    await video.save();
    res.json({ success: true, message: "Comment liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while liking the comment",
    });
  }
};

// Unlike a comment
export const unlikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { videoId, userId } = req.body;
    const video = await Videos.findById(videoId);
    const comment = video.comments.find((c) => c._id.toString() === commentId);
    const userLiked = comment.unlikes.find(
      (unlike) => unlike.userId === userId
    );
    if (userLiked) {
      comment.unlikes = comment.unlikes.filter(
        (unlike) => unlike.userId !== userId
      );
    } else {
      comment.unlikes.push({ userId });
    }
    await video.save();
    res.json({ success: true, message: "Comment liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while liking the comment",
    });
  }
};
