import express from 'express';
import { register, login, logout,sendOtp, verifyEmailWithOtp, isAuthenticated,sendPasswordResetOtp,resetPasswordWithOtp, googleAuthCallback, refreshAccessToken } from '../controllers/authController.js';
import userAuth from './../middleware/userAuth.js';
import passport from 'passport';


const authRouter = express.Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-otp',sendOtp);
authRouter.post('/verify-email-with-otp',verifyEmailWithOtp);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-password-reset-otp',sendPasswordResetOtp);
authRouter.post('/reset-password-with-otp',resetPasswordWithOtp);

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
authRouter.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }),googleAuthCallback);

authRouter.post('/refresh-token',refreshAccessToken)


export default authRouter;