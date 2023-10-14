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
const bcrypt_1 = __importDefault(require("bcrypt"));
const graphql_1 = require("graphql");
const admin_model_1 = require("../model/admin.model");
const fs_1 = require("fs");
const path_1 = require("path");
const graphql_upload_ts_1 = require("graphql-upload-ts");
exports.resolvers = {
    Query: {
        admin: (_, __, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                if (!chekToken.isAdmin) {
                    return new graphql_1.GraphQLError("You are not admin");
                }
                const admin = yield admin_model_1.AdminModels.findOne({ _id: chekToken === null || chekToken === void 0 ? void 0 : chekToken.id });
                return admin;
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
    Mutation: {
        registerAdmin: function (_, { username, lastname, password, file }) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const admin = yield admin_model_1.AdminModels.findOne({ username });
                    if (admin) {
                        return new graphql_1.GraphQLError("username or password incorrect", {
                            extensions: {
                                code: "BADREQUEST",
                                http: { status: 400 },
                            },
                        });
                    }
                    if (password.length < 8) {
                        return new graphql_1.GraphQLError("Client Error", {
                            extensions: {
                                code: "Not only eight symbol",
                                http: { status: 400 },
                            },
                        });
                    }
                    password = bcrypt_1.default.hashSync(password, 10);
                    let { filename, createReadStream } = yield file;
                    const extFile = filename.replace(".", "");
                    const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
                    if (!extPattern)
                        throw new TypeError("Image format is not valid");
                    filename = Date.now() + "-" + filename.replace(/\s/g, "");
                    const stream = createReadStream();
                    const out = (0, fs_1.createWriteStream)((0, path_1.resolve)("src", "uploads", filename));
                    stream.pipe(out);
                    const newUser = yield admin_model_1.AdminModels.create({
                        username,
                        lastname,
                        password,
                        avatar: filename,
                        isActive: true
                    });
                    const TOKEN = jsonwebtoken_1.default.sign({ id: newUser._id, username, isAdmin: true }, "autosalon");
                    return { success: true, data: newUser, access_token: TOKEN };
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
            });
        },
        signinAdmin: function (_, { username, password }) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const admin = yield admin_model_1.AdminModels.findOne({ username, isActive: false });
                    if (!admin) {
                        return new graphql_1.GraphQLError("username or password incorrect", {
                            extensions: {
                                code: "NOT_FOUND",
                                http: { status: 404 },
                            },
                        });
                    }
                    const updateAdmin = yield admin_model_1.AdminModels.updateOne({ username }, { isAdmin: true });
                    const isTrue = bcrypt_1.default.compareSync(password, admin.password);
                    if (!isTrue) {
                        return new graphql_1.GraphQLError("username or password incorrect", {
                            extensions: {
                                code: "BAD_REQUEST",
                                http: { status: 400 },
                            },
                        });
                    }
                    const TOKEN = jsonwebtoken_1.default.sign({ username, id: updateAdmin === null || updateAdmin === void 0 ? void 0 : updateAdmin._id, isAdmin: true }, "autosalon");
                    return { success: true, data: updateAdmin, access_token: TOKEN };
                }
                catch (error) {
                    return new graphql_1.GraphQLError("Internal Server Error", {
                        extensions: {
                            code: "INTERNAL_SERVER_ERROR",
                            http: { status: 500 },
                        },
                    });
                }
            });
        },
        logoutAdmin: (_, __, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                const deletedUser = yield admin_model_1.AdminModels.updateOne({ _id: chekToken === null || chekToken === void 0 ? void 0 : chekToken.id }, { isActive: false });
                return { success: true, data: deletedUser };
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
        updateAdmin: (_, { username, lastname, password, file }, { access_token }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chekToken = jsonwebtoken_1.default.verify(access_token, "autosalon");
                if (!chekToken) {
                    return new graphql_1.GraphQLError("Token required !!!");
                }
                if (password.length < 8) {
                    return new graphql_1.GraphQLError("Client Error", {
                        extensions: {
                            code: "Not only eight symbol",
                            http: { status: 404 },
                        },
                    });
                }
                password = bcrypt_1.default.hashSync(password, 10);
                let { filename, createReadStream } = yield file;
                const extFile = filename.replace(".", "");
                const extPattern = /(jpg|jpeg|png|gif|svg)/gi.test(extFile);
                if (!extPattern)
                    throw new TypeError("Image format is not valid");
                filename = Date.now() + "-" + filename.replace(/\s/g, "");
                const stream = createReadStream();
                const out = (0, fs_1.createWriteStream)((0, path_1.resolve)("src", "uploads", filename));
                stream.pipe(out);
                const updateAdmin = yield admin_model_1.AdminModels.updateOne({ _id: chekToken === null || chekToken === void 0 ? void 0 : chekToken.id }, {
                    username, lastname, password, avatar: filename
                });
                return { success: true, data: updateAdmin };
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
