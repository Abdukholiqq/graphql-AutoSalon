import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { CarsModels } from "../model/cars.model";
import { PostCars } from "../types";
import { CategoryModel } from "../../categories/model/category.model";
import { createWriteStream } from "fs";
import { resolve } from "path";

export const resolvers = {
  Query: {
    cars: async (_: any, __: any, { access_token }: { access_token: any }) => {
      const chekToken: any = jwt.verify(access_token, "autosalon");

      if (!chekToken) {
        return new GraphQLError("Token required !!!");
      }
      if (!chekToken.isAdmin) {
        console.log("siz admin emassiz");
        return new GraphQLError("You are not admin");
      }
      const allCars = await CarsModels.find().populate("category")
      return allCars;
    },
    carById:async (_:any,{carId}:{carId:any},{access_token}:{access_token:any}) => {
      try{
        const chekToken: any = jwt.verify(access_token, "autosalon");

        if (!chekToken) {
          return new GraphQLError("Token required !!!");
        }
        if (!chekToken?.isAdmin) {
          return new GraphQLError("You are not admin");
        }
        const car = await CarsModels.findOne({_id:carId}).populate('category')
        return car
      }catch(error){}
    }
  },
  Mutation: {
    addCars: async (
      _: any,
      {
        Marka,
        Model,
        Tanirovka,
        Motor,
        Year,
        Color,
        Narxi,
        Distance,
        GearBook,
        Description,
        files
      }: {
        Marka: string;
        Model: string,
        Tanirovka: string;
        Motor: string;
        Year: string;
        Color: string;
        Narxi: string,
        Distance: string;
        GearBook: string;
        Description: string;
        files: any  
      },
      { access_token }: { access_token: any }
    ) => {
      try { 
        const chekToken: any = jwt.verify(access_token, "autosalon");

        if (!chekToken) {
          return new GraphQLError("Token required !!!");
        }
        if (!chekToken?.isAdmin) {
          return new GraphQLError("You are not admin");
        }
       Marka = Marka.toUpperCase()
        const categoryId: any = await CategoryModel.find({category_name: Marka})
 
for (let i = 0; i < files.length; i++) {
        var { filename, createReadStream } = await files[i];
      }
        let  filename1 = await files[0]
        let  filename2 = await files[1]
        const extFile = filename.replace(".", "");
        const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
        if (!extPattern) throw new TypeError("Image format is not valid");
        filename = Date.now()+ "-" + filename.replace(/\s/g, "");
        const stream = createReadStream();
      
        filename1 = Date.now()+ "-" + filename1.filename.replace(/\s/g, "");
        filename2 = Date.now()+ "-" + filename2.filename.replace(/\s/g, "");
       
        const out = createWriteStream(resolve("src", "uploads", filename1));
        const out2 = createWriteStream(resolve("src", "uploads", filename2));
        stream.pipe(out);
        stream.pipe(out2)

   const addCars = await CarsModels.create({
          Marka,
          Model,
          Tanirovka,
          Motor,
          Year,
          Color,
          Narxi,
          Distance,
          GearBook,
          Description,
          Internal_picture: filename1,
          External_picture: filename2,
          category:categoryId[0]._id
        });
        //   Database ga yuklanayabdi console.log() ga ham chiqayabdi lekin response qaytarishi qiyin bo'layabdi  faqat shu mutationda
        //      "message": "Failed to fetch",  shunaqa error berayabdi lekin ishlayabdi faqat browserda mutation qilganda ko'rinmay qolayabdi
        return {success:true, data: addCars}
      } catch (error: any) {
        console.log(error.message);
        return new GraphQLError("Internal Server Error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: { status: 500 },
          },
        });
      }
    },
    updateCers: async (
      _: any,
      {
        Marka,
        Tanirovka,
        Motor,
        Year,
        Color,
        Distance,
        GearBook,
        Description,
        carId,
      }: {
        Marka: String;
        Tanirovka: String;
        Motor: String;
        Year: String;
        Color: String;
        Distance: String;
        GearBook: String;
        Description: String;
        carId: String;
      },
      { access_token }: { access_token: any }
    ) => {
      try {
        const chekToken: any = jwt.verify(access_token, "autosalon");
        if (!chekToken) {
          return new GraphQLError("Token required !!!");
        }
        if (!chekToken.isAdmin) {
          return new GraphQLError("Yuo are not admin");
        }
        const updateCers = await CarsModels.updateOne(
          { _id: carId },
          {
            Marka,
            Tanirovka,
            Motor,
            Year,
            Color,
            Distance,
            GearBook,
            Description,
          }
        );
        return { success: true, data: updateCers };
      } catch (error: any) {
        console.log(error.message);
        return new GraphQLError("Internal Server Error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: { status: 500 },
          },
        });
      }
    },
    deleteCars: async (
      _: any,
      { carId }: { carId: string },
      { access_token }: { access_token: any }
    ) => { 
        
      try {
        const chekToken: any = jwt.verify(access_token, "autosalon");
        if (!chekToken) {
          return new GraphQLError("Token required !!!");
        }
        if (!chekToken?.isAdmin) {
          return new GraphQLError("You are not admin");
        }
        const deletedCars = await CarsModels.deleteOne({ _id: carId });
        return { success: true, data: deletedCars };
      } catch (error: any) {
        console.log(error.message);
        return new GraphQLError("Internal Server Error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: { status: 500 },
          },
        });
      }
    },
  },
};
