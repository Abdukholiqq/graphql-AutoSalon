"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarsModels = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cars_schema_1 = require("../schema/cars.schema");
exports.CarsModels = mongoose_1.default.model("cars", cars_schema_1.CarSchema);
