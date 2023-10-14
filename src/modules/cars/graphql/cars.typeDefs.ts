import { resolvers } from "./cars.resolvers";

export const typeDefs = `#graphql
type Query{
 cars: [Cars]
}
type Cars{
  Marka:String 
  Model: String 
  Tanirovka: String 
  Motor: String 
  Year: String 
  Color: String 
  Narxi:String 
  Distance: String 
  GearBook: String 
  Description: String 
  Internal_picture:String
  External_picture: String
  category: Category
}
type Mutation{
    addCars(Marka: String!,Model: String!,Tanirovka: String!,Motor: String!, Year: String!,
      Color: String!,Narxi:String!,Distance: String!,GearBook: String!,Description: String!, files: [Upload!]!):Response
    updateCers(Marka: String,Model:String,Tanirovka: String,Motor: String,Year: String,
      Color: String,Distance: String,Narxi: String,GearBook: String,Description: String, carId:String! , files: Upload):Response
    deleteCars(carId:String!):Response
}
scalar Any
scalar Upload
`;

