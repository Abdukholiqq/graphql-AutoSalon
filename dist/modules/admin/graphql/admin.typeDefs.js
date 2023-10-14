"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql 
scalar Any

type Query {
admin: Admin
}

type Admin { 
_id: ID
username: String
lastname: String
password: String  
avatar: String
}

type Mutation {
    registerAdmin(username: String!, lastname: String, password: String!, file: Upload!): Response
    updateAdmin(username:String, lastname:String, password:String, file: Upload): Response
    signinAdmin(username: String! ,password: String!): Response
    logoutAdmin(id:String): Response
}

type Response{
    success: Boolean
    data: Any
    access_token: String
}
 scalar Any
 scalar Upload
`;
