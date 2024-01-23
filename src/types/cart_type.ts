import mongoose from "mongoose";

export interface CartItem {
    course_id: mongoose.Types.ObjectId;
    quantity: number;
}

export interface CartModel extends mongoose.Document {
    user : mongoose.Types.ObjectId | undefined
    course: CartItem[];
}
