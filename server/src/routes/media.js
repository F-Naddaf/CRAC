import express from "express";
import {
  getAllMedia,
  postVideo,
  getUserMedia,
  getMediaByTitle,
  getVideoById,
  getComments,
  postLater,
  addComment,
  likeComment,
  unlikeComment,
  deleteVideo,
  updateComment,
  deleteComment,
} from "../controllers/media.js";
const mediaRouter = express.Router();

mediaRouter.get("/", getAllMedia);
mediaRouter.get("/getMedia/:userId", getUserMedia);
mediaRouter.get("/search/:title", getMediaByTitle);
mediaRouter.get("/result/:id", getVideoById);
mediaRouter.get("/show-comments/:id", getComments);
mediaRouter.post("/postVideo", postVideo);
mediaRouter.post("/postLater", postLater);
mediaRouter.post("/comment", addComment);
mediaRouter.post("/like/:commentId", likeComment);
mediaRouter.post("/unlike/:commentId", unlikeComment);
mediaRouter.patch("/comment/:commentId", updateComment);
mediaRouter.delete("/comment/:commentId", deleteComment);
mediaRouter.delete("/deleteVideo/:id", deleteVideo);

export default mediaRouter;
