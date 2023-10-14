"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModels = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admin_schema_1 = require("../schema/admin.schema");
exports.AdminModels = mongoose_1.default.model("admins", admin_schema_1.AdminSchema);
