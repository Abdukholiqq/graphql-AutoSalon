import mongoose from "mongoose";
import { UserSchema } from "../schema/user.schema";


export const UserModels = mongoose.model("users", UserSchema);
