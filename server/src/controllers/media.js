import { Videos } from "../models/Media.js";

export const getAllMedia = async (req, res) => {
  try {
    const videos = await Videos.find();
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch videos." });
  }
};

export const addMedia = async (req, res) => {
  const { media, mediaId, userId, userImage } = req.body;
  console.log("req", req.body);
  try {
    if (mediaId) {
      // Update existing video
      const video = await Videos.findById(mediaId);
      if (video) {
        if (media.posted) {
          video.title = media.title;
          video.posted = media.posted;
          video.userId = userId;
          video.userImage = userImage;
          const updatedMedia = await video.save();
          res.status(200).json({ success: true, updatedMedia });
        } else {
          res.status(400).json({
            success: false,
            message: "Invalid request. 'posted' is required.",
          });
        }
      } else {
        res.status(404).json({ success: false, message: "Video not found." });
      }
    } else {
      // Create new video
      const newVideo = await Videos.create({ ...media, userId, userImage });
      res.status(200).json({ success: true, newVideo });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Error." });
  }
};
