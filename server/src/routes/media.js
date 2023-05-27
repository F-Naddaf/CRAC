import express from "express";
import { getAllMedia, addMedia } from "../controllers/media.js";
const mediaRouter = express.Router();

mediaRouter.get("/", getAllMedia);
mediaRouter.post("/postVideo", addMedia);

export default mediaRouter;
