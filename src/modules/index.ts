import { makeExecutableSchema } from "@graphql-tools/schema";

import User from "./users/graphql"; 
import Cars from './cars/graphql'
 import Admin from './admin/graphql'
 import Category from './categories/graphql'

export default makeExecutableSchema({
  typeDefs: [User.typeDefs, Admin.typeDefs, Cars.typeDefs, Category.typeDefs],
  resolvers: [User.resolvers, Admin.resolvers, Cars.resolvers, Category.resolvers],
});
