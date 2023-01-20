import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  userName: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    require: true,
  },
  followers: {
    type: [Schema.Types.ObjectId],
  },
  follows: {
    type: [Schema.Types.ObjectId],
  },
  reports: {
    type: [Schema.Types.ObjectId],
  },
  favorites: {
    type: [Schema.Types.ObjectId],
  },
  isPremium: {
    type: Boolean,
    require: true,
  },
  wasBanned: {
    type: Boolean,
    require: true,
  },
  image: {
    type: String,
    default: null,
    trim: true,
  },
});

//Hash password before save the user
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    throw new Error("Error with password hash");
  }
});
userSchema.pre("updateOne", async function (next) {
  const user = this.getUpdate();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    throw new Error("Error with password hash");
  }
});

//Method compare passwords
userSchema.methods.comparePasswords = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model("User", userSchema);
