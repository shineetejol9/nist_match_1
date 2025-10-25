// passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/User.js"; // Mongoose User model

// ✅ Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,          // from Google Cloud Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // from Google Cloud Console
      callbackURL: `${BACKEND_URL}/auth/google/callback`

    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // ✅ Create a new user if not found
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

        // ✅ Return the user to Passport
        return done(null, user);
      } catch (err) {
        console.error("❌ Error in Google Strategy:", err);
        return done(err, null);
      }
    }
  )
);

// ✅ Serialize user ID to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

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
