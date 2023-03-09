import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";

// The environment should set the port
const port = process.env.PORT;
if (port == null) {
  logError(new Error("Cannot find a PORT number, did you create a .env file?"));
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      logInfo(`Server started on port ${port}`);
    });
  } catch (error) {
    logError(error);  
  }
};

startServer();