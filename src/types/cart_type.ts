import mongoose from "mongoose";
import { CourseResponseType } from "./course_type.js";
import { mongoId } from "./mongoose_type.js";



export interface CartModel extends mongoose.Document {
    user : mongoose.Types.ObjectId | undefined
    course: mongoId[];
}

export interface CartCourseType{
    course_id : string
    details : CourseResponseType[]
}

export interface CartItemListType {
    _id : string
    user : string
    course : CartCourseType[]
}
