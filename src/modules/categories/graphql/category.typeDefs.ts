import { resolvers } from "./category.resolvers";
export const typeDefs = `#graphql

type Query{
    allCategories: [Category] 
}
type Category{
    _id: ID,
    category_name: String
    category_image: String  
}
type Mutation{
    addCategory(category_name:String!, file: Upload!): Any
    updateCategory(categoryId: String!, category_name:String!): Response
    deleteCategory(categoryId:String!):Response
}

type Response{
    success: Boolean
    data: Any
    access_token: String
}
scalar Upload
scalar Any

`




