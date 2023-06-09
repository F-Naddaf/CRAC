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
    const existingVideo = await Videos.findOne({ url: media.url });

    if (existingVideo) {
      if (media.posted) {
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
      const newVideo = await Videos.create({
        title: media.title,
        url: media.url,
        posted: media.posted,
        userId: userId,
        userImage: userImage,
        username: username,
      });
    }
    res
      .status(200)
      .json({ success: true, message: "Video saved successfully" });
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
  const { videoId } = req.params;

  try {
    const video = await Videos.findById(videoId);
    res.status(200).json({ video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve video" });
  }
};
