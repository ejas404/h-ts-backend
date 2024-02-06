import mongoose from "mongoose";
import { CourseResponseType } from "./course_type";

export interface CartItem {
    course_id: mongoose.Types.ObjectId;
}

export interface CartModel extends mongoose.Document {
    user : mongoose.Types.ObjectId | undefined
    course: CartItem[];
}

export interface CartCourseType extends CartItem{
    details : CourseResponseType[]
}

export interface CartItemListType {
    _id : string
    user : string
    course : CartCourseType[]
}
