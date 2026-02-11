
export const emailTemplates = {
  welcome: ({ name }) => `
    <div style="font-family: Arial; text-align:center; padding:20px;">
      <h2>Welcome ${name} </h2>
      <p>Thank you for joining WeBuildSolutions.</p>
      <p>We’re excited to have you onboard.</p>
    </div>
  `,
  verifyOtp: ({ otp }) => `
    <div style="font-family: Arial; text-align:center; padding:20px;">
      <h2>Your OTP Code</h2>
      <p>Use the following OTP to verify your account:</p>
      <h1 style="font-size: 24px; color: #333;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `,
  resetOtp: ({ otp }) => `
    <div style="font-family: Arial; text-align:center; padding:20px;">
      <h2>Password Reset OTP</h2>
      <p>Use the following OTP to reset your password:</p>
      <h1 style="font-size: 24px; color: #333;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `,

}; 