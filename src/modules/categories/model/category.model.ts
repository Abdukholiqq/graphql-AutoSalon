import mongoose from "mongoose";
import { CategorySchema } from "../schema/category.schema";

export const CategoryModel = mongoose.model("category", CategorySchema)