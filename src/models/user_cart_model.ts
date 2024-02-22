import mongoose from "mongoose";
import { CartModel } from "../types/cart_type.js";

const Schema = mongoose.Schema

const cartSchema = new Schema<CartModel>({
    user : {type : mongoose.Types.ObjectId , ref : 'student'},
    course : [{type : mongoose.Types.ObjectId , ref : 'course', required : true}]
})

const cartCollection = mongoose.model('cart',cartSchema)
export default cartCollection