import mongoose from "mongoose";
import { CartModel } from "../types/cart_type";

const Schema = mongoose.Schema

const cartSchema = new Schema<CartModel>({
    user : {type : mongoose.Types.ObjectId , ref : 'student'},
    course : [{
        course_id : {type : mongoose.Types.ObjectId , ref : 'course', required : true},
        quantity : {type : Number, default : 1}
    }]
})

const cartCollection = mongoose.model('cart',cartSchema)
export default cartCollection