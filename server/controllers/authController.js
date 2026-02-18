import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { sendEmail } from "../services/email.service.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    
    // Generate OTP immediately
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();
     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
    // Send OTP email
    try {
      await sendEmail({
        to: email,
        subject: "Verify Your Email",
        type: "verifyOtp",
        data: { name, otp },
      });
    } catch (emailError) {
      console.error("OTP email failed to send:", emailError);
      
    }

   

    // sendEmail({
    //   to: email,
    //   subject: "Welcome to Our App!",
    //   type: "welcome",
    //   data: { name },
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields" });
  }
  try {
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ success: true, message: "User logged in successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: "Your OTP Code",
        type: "verifyOtp",
        data: { name: user.name, otp },
      });
    } catch (emailError) {
      console.error("OTP email failed to send:", emailError);
      return res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }
    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmailWithOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification request",
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiry = undefined;

    await user.save();
    
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to Our App!",
        type: "welcome",
        data: { name: user.name },
      });
    } catch (emailError) {
      console.error("Welcome email failed to send:", emailError);
      // Don't fail verification if welcome email fails
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//send password reset otp

export const sendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    try {
      await sendEmail({
        to: user.email,
        subject: "Your Password Reset OTP",
        type: "resetOtp",
        data: { name: user.name, otp },
      });
    } catch (emailError) {
      console.error("Reset OTP email failed to send:", emailError);
      return res.status(500).json({ success: false, message: "Failed to send reset OTP email" });
    }
    res
      .status(200)
      .json({ success: true, message: "Password reset OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// reset password with otp

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.resetOtp !== otp || user.resetOtp === "") {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const googleAuthCallback = async (req, res) => {
  try{
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? process.env.PRODUCTION_FRONTEND_URL 
      : process.env.FRONTEND_URL;
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(frontendUrl);
  }catch(error){
        console.error("Google OAuth callback error:", error);
        const frontendUrl = process.env.NODE_ENV === 'production' 
          ? process.env.PRODUCTION_FRONTEND_URL 
          : process.env.FRONTEND_URL;
        res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
};  