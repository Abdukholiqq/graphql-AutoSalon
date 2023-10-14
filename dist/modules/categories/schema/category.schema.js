"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CategorySchema = new mongoose_1.default.Schema({
    category_name: {
        type: String,
        minLength: 2
    },
    category_image: String,
    cars: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "cars",
    },
});
