"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@graphql-tools/schema");
const graphql_1 = __importDefault(require("./users/graphql"));
const graphql_2 = __importDefault(require("./cars/graphql"));
const graphql_3 = __importDefault(require("./admin/graphql"));
const graphql_4 = __importDefault(require("./categories/graphql"));
exports.default = (0, schema_1.makeExecutableSchema)({
    typeDefs: [graphql_1.default.typeDefs, graphql_3.default.typeDefs, graphql_2.default.typeDefs, graphql_4.default.typeDefs],
    resolvers: [graphql_1.default.resolvers, graphql_3.default.resolvers, graphql_2.default.resolvers, graphql_4.default.resolvers],
});
