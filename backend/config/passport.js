// config/passport.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Assuming you have a User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Google OAuth credentials
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Redirect URL after successful login
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If user doesn't exist, create a new one
          user = await User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            profileImageUrl: profile.photos[0].value,
          });
        }
        
        // Pass user info to done() for session
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Get user by ID from database
  } catch (err) {
    done(err, null);
  }
});

