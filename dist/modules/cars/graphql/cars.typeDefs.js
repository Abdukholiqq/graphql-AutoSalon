"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
type Query{
 cars: [Cars]
 carById(carId: ID): Cars
}
type Cars{
  _id: ID
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
