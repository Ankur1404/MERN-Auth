import bcrypt from "bcryptjs";

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOtp = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

export const compareOtp = async (enteredOtp, hashedOtp) => {
  return await bcrypt.compare(enteredOtp, hashedOtp);
};