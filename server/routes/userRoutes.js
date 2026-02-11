import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import userAuth from './../middleware/userAuth.js';

const userRouter = express.Router();
userRouter.get('/profile', userAuth, getUserProfile);
export default userRouter;