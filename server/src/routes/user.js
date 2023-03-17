import express from 'express';
import { addUserPhone, verifyCode } from '../controllers/user.js';
const userRouter = express.Router();

userRouter.post('/phone', addUserPhone);
userRouter.post('/phone/verify', verifyCode);

export default userRouter;
