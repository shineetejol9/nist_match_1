// passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "./models/User.js"; // Mongoose User model

// Load environment variables
dotenv.config();

// Detect environment (Render = production)
const isProduction = process.env.NODE_ENV === "production";

// Use correct backend URL
const BACKEND_URL = isProduction
  ? process.env.BACKEND_URL_PROD
  : process.env.BACKEND_URL;

// ✅ Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || "No email provided",
            profilePic: profile.photos?.[0]?.value || "",
          });
          console.log("🆕 New user created:", user.name);
        } else {
          console.log("✅ Existing user found:", user.name);
        }

        return done(null, user);
      } catch (err) {
        console.error("❌ Error in Google Strategy:", err);
        return done(err, null);
      }
    }
  )
);

// ✅ Serialize user ID to session
passport.serializeUser((user, done) => done(null, user.id));

// ✅ Deserialize user from session by ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
