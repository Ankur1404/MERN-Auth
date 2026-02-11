import userModel from "../models/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");  
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message
     });
  }
};