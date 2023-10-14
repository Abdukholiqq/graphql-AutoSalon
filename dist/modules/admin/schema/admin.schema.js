"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.AdminSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100,
    },
    lastname: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    avatar: String,
    isActive: Boolean
});
