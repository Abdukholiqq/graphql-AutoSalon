import mongoose from "mongoose";
import { CarSchema } from "../schema/cars.schema";

export const CarsModels = mongoose.model("cars", CarSchema);