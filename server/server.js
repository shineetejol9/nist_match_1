import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";

// Load environment variables
dotenv.config({
  path: path.resolve(process.env.NODE_ENV === "production" ? "./.env" : "./nist.env"),
});

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.NODE_ENV === "production"
  ? process.env.VITE_API_URL
  : "http://localhost:5173";

// ====== Middleware ======
app.use(bodyParser.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// ====== MongoDB Connection ======
mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== Session ======
const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key_here",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);

// ====== User Model ======
const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// ====== Passport Setup ======
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${FRONTEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos?.[0]?.value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
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

// ====== Routes ======
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    if (!user.age || !user.gender || !user.occupation || !user.relationshipType) {
      res.redirect(`${FRONTEND_URL}/create-profile?_id=${user._id}`);
    } else {
      res.redirect(`${FRONTEND_URL}/?loggedIn=true`);
    }
  }
);

app.get("/api/me", (req, res) => {
  if (req.isAuthenticated()) return res.json(req.user);
  res.status(401).json({ error: "Not authenticated" });
});

app.post("/api/saveProfile", async (req, res) => {
  const { _id } = req.body;
  if (!_id) return res.status(400).json({ error: "_id required" });

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new: true });
    res.json({ message: "Profile saved!", user: updatedUser });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(FRONTEND_URL);
    });
  });
});

// ====== Root Route ======
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ====== Serve Frontend in Production ======
if (isProduction) {
  app.use(express.static(path.join(process.cwd(), "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client/dist", "index.html"));
  });
}

// ====== Start Server ======
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
