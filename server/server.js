import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Load environment variables
dotenv.config({ path: path.resolve("C:/Users/Shinee sohan/Github/nist_match_1/nist.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false, cookie: { secure: false } }));


app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  age: String,
  gender: String,
  location: String,
  occupation: String,
  hobbies: String,
  uniqueness: String,
  myType: String,
  height: String,
  weight: String,
  figureSkinColor: String,
  education: String,
  pets: String,
  languages: String,
  zodiacSign: String,
  habits: String,
  relationshipType: String,
  profilePic: String,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Passport Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"

}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePic: profile.photos[0].value
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Routes

// Google auth routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful login, send user data or redirect
    res.redirect("http://localhost:5173"); // frontend URL
  }
);

// Save new profile
app.post("/api/saveProfile", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

  try {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json({ message: "Profile saved!", user: saved });
  } catch (err) {
    console.error("Mongo save error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Update profile
app.put("/api/saveProfile", async (req, res) => {
  const { _id, ...updateData } = req.body;
  if (!_id) return res.status(400).json({ error: "User ID (_id) is required for update" });

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated!", user: updatedUser });
  } catch (err) {
    console.error("Mongo update error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const filter = req.query || {};
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current logged-in user (Google login)
app.get("/api/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Logout
app.get("/api/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("http://localhost:5173");
  });

});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
