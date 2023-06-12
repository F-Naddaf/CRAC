import express from "express";
import {
  getAllMedia,
  postVideo,
  getUserMedia,
  getMediaByTitle,
  getVideoById,
} from "../controllers/media.js";
const mediaRouter = express.Router();

mediaRouter.get("/", getAllMedia);
mediaRouter.get("/getMedia/:userId", getUserMedia);
mediaRouter.get("/search/:title", getMediaByTitle);
mediaRouter.get("/result/:id", getVideoById);
mediaRouter.post("/postVideo", postVideo);

export default mediaRouter;
