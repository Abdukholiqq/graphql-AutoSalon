
import { resolvers } from "./user.resolvers";
export const typeDefs = `#graphql 
scalar Any

type Query {
user: User
}

type User { 
_id: ID
firstname: String
lastname: String
password: String  
avatar:String
}

type Mutation {
    registerUser(firstname: String!, lastname: String, password: String!, file: Upload!): Response
    updateUser(firstname:String, lastname:String, password:String, file: Upload): Response
    signinUser(firstname: String! , password: String!): Response
    logoutUser(id:String): Response
}

type Response{
    success: Boolean
    data: Any
    access_token: String
}
scalar Any
scalar Upload
`;
