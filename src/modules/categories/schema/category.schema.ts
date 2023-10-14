import mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema({
category_name: {
    type : String,
    minLength: 2
},
category_image: String,
cars:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "cars",
  },
})





