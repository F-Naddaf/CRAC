import express from 'express';
import {
  addUserPhone,
  login,
  register,
  verifyCode,
} from '../controllers/user.js';
const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/phone', addUserPhone);
userRouter.post('/phone/verify', verifyCode);

export default userRouter;
