import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { AdminModels } from "../model/admin.model"; 
import { CategoryModel } from "../../categories/model/category.model";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { GraphQLUpload } from "graphql-upload-ts";

export const resolvers = {
  Query: {
    admin: async (_: any, __: any,{access_token}:{access_token:any}) => {
      try{
        const chekToken: any = jwt.verify(access_token, "autosalon");

      if (!chekToken) {
        return new GraphQLError("Token required !!!");
      }
      if (!chekToken.isAdmin) {
        return new GraphQLError("You are not admin")
      }
      const admin: any = await AdminModels.findOne({_id: chekToken?.id});
      return admin;
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

  Mutation: {
    registerAdmin: async function (
      _: any,
      {
        username,
        lastname,
        password,
        file
      }: { username: string; lastname: string; password: string , file: any}
    ) {
      try {
        /* bu yerda admin bir xil username ga ega bo'lishi mumkin emas 
         bu shart log out qilib chiqib ketgan userlarga ham o'rinlidir */
        const admin = await AdminModels.findOne({ username });
        if (admin) {
          return new GraphQLError("username or password incorrect", {
            extensions: {
              code: "BADREQUEST",
              http: { status: 400 },
            },
          });
        }
        if (password.length < 8) {
          return new GraphQLError("Client Error", {
            extensions: {
              code: "Not only eight symbol",
              http: { status: 400 },
            },
          }); 
        }
        password = bcrypt.hashSync(password, 10);
       
        let { filename, createReadStream } = await file;
        const extFile = filename.replace(".", "");
        const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
        if (!extPattern) throw new TypeError("Image format is not valid");
        filename = Date.now()+ "-" + filename.replace(/\s/g, "");

        const stream = createReadStream();
        
        const out = createWriteStream(resolve("src", "uploads", filename));
        stream.pipe(out);


        const newUser = await AdminModels.create({
          username,
          lastname,
          password,
          avatar: filename,
          isActive: true
        });
        const TOKEN = jwt.sign({ id: newUser._id, username , isAdmin:true}, "autosalon");
        

        return { success: true, data: newUser, access_token: TOKEN };
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
    signinAdmin: async function (
      _: any,
      { username, password }: { username: string; password: string }
    ) {
      try {
        // bu yerda faqat log out qilib chiqib ketgan adminlar kirishi mumkin
        const admin = await AdminModels.findOne({ username, isActive: false });
        if (!admin) {
          return new GraphQLError("username or password incorrect", {
            extensions: {
              code: "NOT_FOUND",
              http: { status: 404 },
            },
          });
        }
        /* admin log out qilganda databasedan o'chirilmaydi balki isActive : false bo'ladi 
             log in qilganda isActive : true  bo'ladi */
        const updateAdmin: any = await AdminModels.updateOne({username},{isAdmin: true})
        const isTrue = bcrypt.compareSync(password, admin.password);
        if (!isTrue) {
          return new GraphQLError("username or password incorrect", {
            extensions: {
              code: "BAD_REQUEST",
              http: { status: 400 },
            },
          });
        }
        const TOKEN = jwt.sign({ username , id: updateAdmin?._id, isAdmin: true }, "autosalon");
        return { success: true, data: updateAdmin, access_token: TOKEN };
      } catch (error) {
        return new GraphQLError("Internal Server Error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: { status: 500 },
          },
        });
      }
    },
    logoutAdmin: async (_: any, __:any,{access_token}:{access_token:any})=>{
      try{
        const chekToken: any = jwt.verify(access_token, "autosalon");
        if (!chekToken) {
          return new GraphQLError("Token required !!!");
        } 
        const deletedUser = await AdminModels.updateOne({_id: chekToken?.id},{isActive: false})
        
        
        return {success:true, data: deletedUser}
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
    updateAdmin: async (
      _: any,
      {
        username,
        lastname,
        password,
        file
      }: { username: string; lastname: string; password: string , file: any},{access_token}:{access_token:any})=>{
        try{
          const chekToken: any = jwt.verify(access_token, "autosalon");
          if (!chekToken) {
            return new GraphQLError("Token required !!!");
          } 
          if (password.length < 8) {
            return new GraphQLError("Client Error", {
              extensions: {
                code: "Not only eight symbol",
                http: { status: 404 },
              },
            }); 
          } 
          password = bcrypt.hashSync(password, 10);
  
          let { filename, createReadStream } = await file;
          const extFile = filename.replace(".", "");
          const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
          if (!extPattern) throw new TypeError("Image format is not valid");
          filename = Date.now()+ "-" + filename.replace(/\s/g, "");
  
          const stream = createReadStream();
          const out = createWriteStream(resolve("src", "uploads", filename));
          stream.pipe(out);
          const updateAdmin = await AdminModels.updateOne({_id: chekToken?.id},{
            username, lastname, password, avatar: filename
          })
          return {success: true, data: updateAdmin}


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
