"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const graphql_1 = require("graphql");
const graphql_upload_ts_1 = require("graphql-upload-ts");
const category_model_1 = require("../model/category.model");
const fs_1 = require("fs");
const path_1 = require("path");
exports.resolvers = {
    Query: {
        allCategories: (_, __, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                if (!chekToken.isAdmin) {
                    return new graphql_1.GraphQLError("You are not admin");
                }
                const category = yield category_model_1.CategoryModel.find();
                return category;
            }
            catch (error) {
                console.log(error.message);
                return new graphql_1.GraphQLError("Internal Server Error", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: { status: 500 },
                    },
                });
            }
        }),
    },
    Mutation: {
        addCategory: (_, { category_name, file }, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                let chek = category_name.toUpperCase();
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                if (!chekToken.isAdmin) {
                    return new graphql_1.GraphQLError("You are not admin");
                }
                const chekCategory = yield category_model_1.CategoryModel.find({ category_name: chek });
                let length = chekCategory.length;
                if (length !== 0) {
                    return new graphql_1.GraphQLError("Bad Request Error", {
                        extensions: {
                            code: "BAD_REQUEST_ERROR",
                            http: { status: 404 },
                        },
                    });
                }
                let { filename, createReadStream } = yield file;
                const extFile = filename.replace(".", "");
                const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
                if (!extPattern)
                    throw new TypeError("Image format is not valid");
                filename = Date.now() + "-" + filename.replace(/\s/g, "");
                const stream = createReadStream();
                const out = (0, fs_1.createWriteStream)((0, path_1.resolve)("src", "uploads", filename));
                stream.pipe(out);
                const PostCategory = yield category_model_1.CategoryModel.create({
                    category_name: chek,
                    category_image: filename,
                });
                return { success: true, data: PostCategory };
            }
            catch (error) {
                console.log(error.message);
                return new graphql_1.GraphQLError("Internal Server Error", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: { status: 500 },
                    },
                });
            }
        }),
        updateCategory: (_, { categoryId, category_name, file, }, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                if (!chekToken.isAdmin) {
                    return new graphql_1.GraphQLError("You are not admin");
                }
                let { filename, createReadStream } = yield file;
                const extFile = filename.replace(".", "");
                const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
                if (!extPattern)
                    throw new TypeError("Image format is not valid");
                filename = Date.now() + filename.replace(/\s/g, "");
                const stream = createReadStream();
                const out = (0, fs_1.createWriteStream)((0, path_1.resolve)("src", "uploads", filename));
                stream.pipe(out);
                const updateCategory = yield category_model_1.CategoryModel.updateOne({ _id: categoryId }, {
                    category_name,
                    category_image: filename
                });
                return { success: true, data: updateCategory };
            }
            catch (error) {
                console.log(error.message);
                return new graphql_1.GraphQLError("Internal Server Error", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: { status: 500 },
                    },
                });
            }
        }),
        deleteCategory: (_, { categoryId }, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                if (!chekToken.isAdmin) {
                    return new graphql_1.GraphQLError("You are not admin");
                }
                const deletedCategory = yield category_model_1.CategoryModel.deleteOne({ _id: categoryId });
                return { success: true, data: deletedCategory };
            }
            catch (error) {
                console.log(error.message);
                return new graphql_1.GraphQLError("Internal Server Error", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: { status: 500 },
                    },
                });
            }
        })
    },
    Upload: graphql_upload_ts_1.GraphQLUpload
};
