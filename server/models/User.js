import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    anonymousName: { type: String },
    batch: { type: String },
    gender: { type: String },
    branch: { type: String },
    hobbies: { type: String },
    uniqueness: { type: String },
    partnerType: { type: String }, // "What kind of partner do you like"
    height: { type: String },
    weight: { type: String },
    skinTone: { type: String },
    pets: { type: String },
    languages: { type: String },
    zodiacSign: { type: String },
    habits: { type: String },
    relationshipType: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
