import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const token = req.cookies.token;  
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.userId)
    {
      req.userId = decoded.userId;
    }else{
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;