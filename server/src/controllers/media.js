import { Videos } from "../models/Media.js";

export const getAllMedia = async (req, res) => {
  try {
    const videos = await Videos.find({ posted: true });
    res.status(200).json({ success: true, videos });
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
    console.log("videos", videos);
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
      // Video exists, update it if it's posted
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
      // Video does not exist, create a new video
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
