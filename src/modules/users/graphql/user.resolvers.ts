import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { UserModels } from "../model/user.model"; 
import { createWriteStream } from "fs";
import { resolve } from "path";
import { GraphQLUpload } from "graphql-upload-ts";

export const resolvers = {
  Query: {
    user: async (_: any, __: any,{access_token}:{access_token:any}) => {
      try{
        const chekToken: any = jwt.verify(access_token, "autosalon");

      if (!chekToken) {
        return new GraphQLError("Token required !!!");
      }
      const user: any = await UserModels.findOne({_id: chekToken?.id});
      return user;
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
    registerUser: async function (
      _: any,
      {
        firstname,
        lastname,
        password,
        file
      }: { firstname: string; lastname: string; password: string , file:any }
    ) {
      try {
        // bu yerda user bir xil firstname ga ega bo'lishi mumkin emas
        const user = await UserModels.findOne({ firstname , isActive:true });
        if (user) {
          return new GraphQLError("firstname or password incorrect", {
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

        const newUser = await UserModels.create({
          firstname,
          lastname,
          password,
          avatar: filename,
          isActive: true
        });
        const TOKEN = jwt.sign({ id: newUser._id, firstname }, "autosalon");
     
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
    signinUser: async function (
      _: any,
      { firstname, password }: { firstname: string; password: string }
    ) {
      try {
        const user = await UserModels.findOne({ firstname, isActive: false });
        if (!user) {
          return new GraphQLError("firstname or password incorrect", {
            extensions: {
              code: "NOT_FOUND",
              http: { status: 404 },
            },
          });
        }
        /* user log out qilganda databasedan o'chirmaydi balki isActive : false bo'ladi 
             log in qilganda isActive : true  bo'ladi */
        const updateUser = await UserModels.updateOne({firstname},{isAdmin: true})
        const isTrue = bcrypt.compareSync(password, user.password);
        if (!isTrue) {
          return new GraphQLError("firstname or password incorrect", {
            extensions: {
              code: "BAD_REQUEST",
              http: { status: 400 },
            },
          });
        }
        const TOKEN = jwt.sign({ firstname }, "autosalon");
        return { success: true, data: updateUser, access_token: TOKEN };
      } catch (error) {
        return new GraphQLError("Internal Server Error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: { status: 500 },
          },
        });
      }
    },
    logoutUser: async (_: any, __:any,{access_token}:{access_token:any})=>{
      try{
        const chekToken: any = jwt.verify(access_token, "autosalon");
        if (!chekToken) {
          return new GraphQLError("Token required !!!");
        }
        const id = chekToken?.id 
        
        const deletedUser = await UserModels.updateOne({_id: chekToken?.id},{isActive: false})
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
    updateUser:async (_: any,  {
      firstname,
      lastname,
      password,
      file
    }: { firstname: string; lastname: string; password: string , file:any },
    {access_token}:{access_token:any})=>{
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
        const updateUser = UserModels.updateOne({_id: chekToken?.id},{
           firstname,
           lastname,
           password,
           avatar: filename
        })
        return {success: true, data: updateUser}
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
