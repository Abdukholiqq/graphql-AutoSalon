import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { GraphQLUpload, Upload } from "graphql-upload-ts";

import { CategoryModel } from "../model/category.model";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { CarsModels } from "../../cars/model/cars.model";

export const resolvers = {
  Query: {    
    allCategories: async (_: any, __: any,{access_token}:{access_token:any}) => {
      try{
        const chekToken: any = jwt.verify(access_token, "autosalon");

      if (!chekToken) {
        return new GraphQLError("Token required !!!");
      }
      if (!chekToken.isAdmin) {
        return new GraphQLError("You are not admin")
      } 

      const category = await CategoryModel.find()       
      return category;
    }catch (error: any) {
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
  Mutation: {
    addCategory: async (
      _: any,
      { category_name, file }: { category_name: string, file: any },
      { access_token }: { access_token: any }
    ) => {
      try { 
        const chekToken: any = jwt.verify(access_token, "autosalon");
       let chek:string = category_name.toUpperCase()
        
        if (!chekToken) {
          return new GraphQLError("Token required !!!");
        }
        if (!chekToken.isAdmin) {
          return new GraphQLError("You are not admin");
        }
        const chekCategory: any = await CategoryModel.find({category_name: chek}) 
        
        let length: number = chekCategory.length
        /* bu yerda category nomlari bir xil bo'lib qolmasligi uchun code yozilgan
         lekin negadir xatoni ushlab qaytarolmayabdi code to'g'ri yozilgan */
        if (length !== 0) {  
          return new GraphQLError("Bad Request Error", {
            extensions: {
              code: "BAD_REQUEST_ERROR",
              http: { status: 404 },
            },
          })
        } 

        let { filename, createReadStream } = await file;
        const extFile = filename.replace(".", "");
        const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
        if (!extPattern) throw new TypeError("Image format is not valid");
        filename = Date.now()+ "-" + filename.replace(/\s/g, "");

        const stream = createReadStream();
        
        const out = createWriteStream(resolve("src", "uploads", filename));
        stream.pipe(out);
           const PostCategory = await CategoryModel.create({
          category_name: chek,
          category_image: filename,
        }); 
        return { success: true, data: PostCategory };
      
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
    updateCategory: async (
      _: any,
      {
        categoryId,
        category_name,
        file,
      }: { categoryId: string; category_name: string; file: any },
      { access_token }: { access_token: any }
    ) => {
      try {
        const chekToken: any = jwt.verify(access_token, "autosalon");
        if (!chekToken) {
          return new GraphQLError("Token required !!!");
        }
        if (!chekToken.isAdmin) {
          return new GraphQLError("You are not admin");
        }
        let { filename, createReadStream } = await file;

        const extFile = filename.replace(".", "");
        const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
        if (!extPattern) throw new TypeError("Image format is not valid");
        filename = Date.now() + filename.replace(/\s/g, "");

        const stream = createReadStream();
        const out = createWriteStream(resolve("src", "uploads", filename));
        stream.pipe(out);
        const updateCategory = await CategoryModel.updateOne(
          { _id: categoryId },
          { 
            category_name,
             category_image: filename 
            }
        );
        return { success: true, data: updateCategory };
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
    deleteCategory: async (_:any,{categoryId}:{categoryId: string},{access_token}:{access_token:any}) =>{
        try{
            const chekToken: any = jwt.verify(access_token, "autosalon");
      if (!chekToken) {
        return new GraphQLError("Token required !!!");
      }
      if (!chekToken.isAdmin) {
        return new GraphQLError("You are not admin");
      }
        const deletedCategory = await CategoryModel.deleteOne({_id: categoryId})
        return {success:true, data:deletedCategory}
        }catch (error: any) {
            console.log(error.message);
            return new GraphQLError("Internal Server Error", {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                http: { status: 500 },
              },
            });
          }
    }
  },
  Upload: GraphQLUpload
};
