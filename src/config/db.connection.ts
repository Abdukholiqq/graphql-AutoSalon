import mongoose from "mongoose";

export async function connection(url:any) {
  try {
    await mongoose.connect(url);
    console.log("connection is established successfully!");
  } catch (error:any) {
    console.log(error.message);
    return { status: 500, message: error.message };
  }
}
