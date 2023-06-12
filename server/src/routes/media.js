import express from "express";
import {
  getAllMedia,
  postVideo,
  getUserMedia,
  getMediaByTitle,
  getVideoById,
  postLater,
} from "../controllers/media.js";
const mediaRouter = express.Router();

mediaRouter.get("/", getAllMedia);
mediaRouter.get("/getMedia/:userId", getUserMedia);
mediaRouter.get("/search/:title", getMediaByTitle);
mediaRouter.get("/result/:id", getVideoById);
mediaRouter.post("/postVideo", postVideo);
mediaRouter.post("/postLater", postLater);

export default mediaRouter;
