import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from your nist.env file
dotenv.config({ path: path.resolve("C:/Users/Shinee sohan/Github/nist_match_1/nist.env") });

console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

// User schema
const userSchema = new mongoose.Schema({
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

// Routes
app.post("/api/saveProfile", async (req, res) => {
  console.log("Incoming data:", req.body); // <-- debug log
  try {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    console.log("Saved user:", saved); // <-- debug log
    res.status(201).json({ message: "Profile saved!", user: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});


app.get("/api/users", async (req, res) => {
  try {
    const filter = req.query || {};
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
