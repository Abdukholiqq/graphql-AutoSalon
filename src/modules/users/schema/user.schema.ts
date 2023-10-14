import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  lastname: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  avatar: String,
  isActive: Boolean
});
