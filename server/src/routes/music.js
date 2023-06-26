import express from "express";
import { getAllMusica, addMusic } from "../controllers/music.js";
const musicRouter = express.Router();

musicRouter.get("/", getAllMusica);
musicRouter.post("/", addMusic);

export default musicRouter;
