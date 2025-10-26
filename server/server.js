import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import User from "./models/User.js"; // Make sure your User model is in ./models/User.js

// ===== Environment =====
const isProduction = process.env.NODE_ENV === "production";

dotenv.config({
  path: isProduction ? "./.env" : "./nist.env",
});

const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = isProduction
  ? process.env.FRONTEND_URL_PROD
  : process.env.FRONTEND_URL;

const BACKEND_URL = isProduction
  ? process.env.BACKEND_URL_PROD
  : process.env.BACKEND_URL;

// ===== Middleware =====
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "https://nist-match-1.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Session =====
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);


// ===== Passport Setup =====
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            profilePic: profile.photos?.[0]?.value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ===== Routes =====

// Google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: FRONTEND_URL }),
  (req, res) => {
    const user = req.user;
    if (!user.age || !user.gender || !user.occupation || !user.relationshipType) {
      res.redirect(`${FRONTEND_URL}/create-profile?_id=${user._id}`);
    } else {
      res.redirect(`${FRONTEND_URL}/?loggedIn=true`);
    }
  }
);

// Get logged-in user
app.get("/api/me", (req, res) => {
  if (req.isAuthenticated()) return res.json(req.user);
  res.status(401).json({ error: "Not authenticated" });
});

// Allowed fields for profile updates
const allowedFields = [
  "age",
  "gender",
  "location",
  "occupation",
  "hobbies",
  "uniqueness",
  "myType",
  "height",
  "weight",
  "skinTone",
  "education",
  "pets",
  "languages",
  "zodiacSign",
  "habits",
  "relationshipType",
  "profilePic",
];

// Save/update profile
app.post("/api/saveProfile", async (req, res) => {
  const { _id, ...rest } = req.body;
  if (!_id) return res.status(400).json({ error: "_id required" });

  const updateData = {};
  for (let key of allowedFields) {
    if (rest[key] !== undefined) updateData[key] = rest[key];
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
    res.json({ message: "Profile saved!", user: updatedUser });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout
app.get("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });
      res.redirect(FRONTEND_URL);
    });
  });
});

// Root
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
