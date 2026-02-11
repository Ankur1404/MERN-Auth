import express from 'express';
import { register, login, logout,sendOtp, verifyEmailWithOtp, isAuthenticated,sendPasswordResetOtp,resetPasswordWithOtp } from '../controllers/authController.js';
import userAuth from './../middleware/userAuth.js';

const authRouter = express.Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-otp',userAuth,sendOtp);
authRouter.post('/verify-email-with-otp',userAuth,verifyEmailWithOtp);
authRouter.post('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-password-reset-otp',sendPasswordResetOtp);
authRouter.post('/reset-password-with-otp',resetPasswordWithOtp);

export default authRouter;