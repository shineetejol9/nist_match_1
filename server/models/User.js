import mongoose from "mongoose";

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

export default User;
