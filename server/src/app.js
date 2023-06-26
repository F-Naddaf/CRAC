import express from "express";
import cors from "cors";

import userRouter from "./routes/user.js";
import mediaRouter from "./routes/media.js";
import musicRouter from "./routes/music.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/videos", mediaRouter);
app.use("/api/music", musicRouter);

export default app;
