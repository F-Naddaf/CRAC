import express from "express";
import { getAllMedia } from "../controllers/media.js";
const mediaRouter = express.Router();

mediaRouter.get("/", getAllMedia);

export default mediaRouter;
