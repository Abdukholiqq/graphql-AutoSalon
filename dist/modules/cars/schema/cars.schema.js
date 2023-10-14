"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CarSchema = new mongoose_1.default.Schema({
    Marka: {
        type: String,
        required: true,
        maxLength: 100,
    },
    Model: {
        type: String,
        required: true,
        maxLength: 20
    },
    Tanirovka: {
        type: String,
        required: true,
        maxLength: 10,
    },
    Motor: {
        type: String,
        required: true,
        maxLength: 4,
    },
    Year: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 4,
    },
    Color: {
        type: String,
        required: true,
        maxLength: 100,
    },
    Distance: {
        type: String,
        required: true,
        maxLength: 100,
    },
    Narxi: {
        type: String,
        required: true,
    },
    GearBook: {
        type: String,
        required: true,
        maxLength: 50,
    },
    Description: {
        type: String,
        required: true,
        maxLength: 500,
    },
    Internal_picture: String,
    External_picture: String,
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "category",
    },
});
