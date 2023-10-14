import { ApolloServer } from "@apollo/server"; 
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { graphqlUploadExpress } from 'graphql-upload-ts';
 import schema from "./modules";
import { connection } from "./config/db.connection";
import { resolve } from "path"; 



const app = express();
const httpServer = http.createServer(app);

(async () => {
  await connection("mongodb://127.0.0.1:27017/AutoSalon");

  const server = new ApolloServer({
    schema,
    csrfPrevention: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  app.use(express.static(resolve('src' ,"uploads")));
  app.use(
        '/graphql',
        graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 2 }),
        cors(),
        express.json(),
        expressMiddleware(server, {
        context: async ({ req, res }) => {
              const token = req.headers.authorization || "";
              return { access_token: token };
            },
        } ),
    
      );

  await new Promise<void>((resolve) => httpServer.listen({ port: 5555 }, resolve));
  console.log(`🚀 Server ready at http://localhost:5555/`);
})(); 
 