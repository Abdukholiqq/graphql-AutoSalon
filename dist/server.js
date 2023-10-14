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
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = __importDefault(require("http"));
const graphql_upload_ts_1 = require("graphql-upload-ts");
const modules_1 = __importDefault(require("./modules"));
const db_connection_1 = require("./config/db.connection");
const path_1 = require("path");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_connection_1.connection)("mongodb://127.0.0.1:27017/AutoSalon");
    const server = new server_1.ApolloServer({
        schema: modules_1.default,
        csrfPrevention: false,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    yield server.start();
    app.use(express_1.default.static((0, path_1.resolve)('src', "uploads")));
    app.use('/graphql', (0, graphql_upload_ts_1.graphqlUploadExpress)({ maxFileSize: 10000000, maxFiles: 2 }), (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            const token = req.headers.authorization || "";
            return { access_token: token };
        }),
    }));
    yield new Promise((resolve) => httpServer.listen({ port: 5555 }, resolve));
    console.log(`🚀 Server ready at http://localhost:5555/`);
}))();
