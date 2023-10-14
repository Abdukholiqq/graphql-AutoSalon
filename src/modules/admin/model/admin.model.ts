import mongoose from "mongoose";

import { AdminSchema } from "../schema/admin.schema";

export const AdminModels = mongoose.model("admins", AdminSchema)