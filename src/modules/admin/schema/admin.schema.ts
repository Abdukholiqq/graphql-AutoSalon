import mongoose from "mongoose";

export const AdminSchema = new mongoose.Schema({
  username: {
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
