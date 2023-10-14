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
const cars_model_1 = require("../model/cars.model");
const category_model_1 = require("../../categories/model/category.model");
const fs_1 = require("fs");
const path_1 = require("path");
exports.resolvers = {
    Query: {
        cars: (_, __, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
            if (!chekToken) {
                return new graphql_1.GraphQLError("Token required !!!");
            }
            if (!chekToken.isAdmin) {
                console.log("siz admin emassiz");
                return new graphql_1.GraphQLError("You are not admin");
            }
            const allCars = yield cars_model_1.CarsModels.find().populate("category");
            return allCars;
        }),
    },
    Mutation: {
        addCars: (_, { Marka, Model, Tanirovka, Motor, Year, Color, Narxi, Distance, GearBook, Description, files }, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                if (!(chekToken === null || chekToken === void 0 ? void 0 : chekToken.isAdmin)) {
                    return new graphql_1.GraphQLError("You are not admin");
                }
                Marka = Marka.toUpperCase();
                const categoryId = yield category_model_1.CategoryModel.find({ category_name: Marka });
                for (let i = 0; i < files.length; i++) {
                    var { filename, createReadStream } = yield files[i];
                }
                let filename1 = yield files[0];
                let filename2 = yield files[1];
                const extFile = filename.replace(".", "");
                const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
                if (!extPattern)
                    throw new TypeError("Image format is not valid");
                filename = Date.now() + "-" + filename.replace(/\s/g, "");
                const stream = createReadStream();
                filename1 = Date.now() + "-" + filename1.filename.replace(/\s/g, "");
                filename2 = Date.now() + "-" + filename2.filename.replace(/\s/g, "");
                const out = (0, fs_1.createWriteStream)((0, path_1.resolve)("src", "uploads", filename1));
                const out2 = (0, fs_1.createWriteStream)((0, path_1.resolve)("src", "uploads", filename2));
                stream.pipe(out);
                stream.pipe(out2);
                const addCars = yield cars_model_1.CarsModels.create({
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
                    category: categoryId[0]._id
                });
                return { success: true, data: addCars };
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
        updateCers: (_, { Marka, Tanirovka, Motor, Year, Color, Distance, GearBook, Description, carId, }, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                if (!chekToken.isAdmin) {
                    return new graphql_1.GraphQLError("Yuo are not admin");
                }
                const updateCers = yield cars_model_1.CarsModels.updateOne({ _id: carId }, {
                    Marka,
                    Tanirovka,
                    Motor,
                    Year,
                    Color,
                    Distance,
                    GearBook,
                    Description,
                });
                return { success: true, data: updateCers };
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
        deleteCars: (_, { carId }, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                if (!(chekToken === null || chekToken === void 0 ? void 0 : chekToken.isAdmin)) {
                    return new graphql_1.GraphQLError("You are not admin");
                }
                const deletedCars = yield cars_model_1.CarsModels.deleteOne({ _id: carId });
                return { success: true, data: deletedCars };
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
};
