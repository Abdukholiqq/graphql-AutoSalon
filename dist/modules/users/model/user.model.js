"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModels = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_schema_1 = require("../schema/user.schema");
exports.UserModels = mongoose_1.default.model("users", user_schema_1.UserSchema);
