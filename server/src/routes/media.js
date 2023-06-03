import express from "express";
import { getAllMedia, postVideo, getUserMedia } from "../controllers/media.js";
const mediaRouter = express.Router();

mediaRouter.get("/", getAllMedia);
mediaRouter.get("/getMedia/:userId", getUserMedia);
mediaRouter.post("/postVideo", postVideo);

export default mediaRouter;
