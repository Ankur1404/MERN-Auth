import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
  },
  async(accessToken, refreshToken, profile, done) =>{
    try{

      let user = await User.findOne({ googleId: profile.id })
      if(!user)
      {
        const existingUserByEmail = await User.findOne({ email: profile.emails[0].value })
        // SECURITY: Check if email is verified by Google
        const isVerified = profile._json.email_verified;
        
        if(existingUserByEmail && isVerified)
        {
          existingUserByEmail.googleId = profile.id
          existingUserByEmail.avatar = profile.photos[0].value
          await existingUserByEmail.save()
          user = existingUserByEmail
        }
        else if(!existingUserByEmail)
        {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            googleId: profile.id,
            isVerified: isVerified
          })
        }
        else if(existingUserByEmail && !isVerified)
        {
          return done(new Error('Email not verified by Google. Cannot link to existing account.'), null);
        }
      }
      return done(null, user);
    }catch(error){
        console.error("Google OAuth error:", error);
        return done(error, null);
    }
    
  }
));
