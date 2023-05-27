import express from "express";
import cors from "cors";

import userRouter from "./routes/user.js";
import mediaRouter from "./routes/media.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/videos", mediaRouter);

export default app;
