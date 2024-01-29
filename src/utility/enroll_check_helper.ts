import enrollCollection from "../models/course_enroll_model";
import { mongoId } from "../types/mongoose_type";
import { fetchCartItemList } from "./cart_details_fetch";

export const isCourseEnrolled = async (course : mongoId, user : mongoId) => {
    const isEnrolled = await enrollCollection.findOne({user, course})
    console.log('is enrolled printing', isEnrolled)
    return !!isEnrolled 
}

export const isCartItemsEnrolled = async(user : mongoId) =>{
    const cartList = await fetchCartItemList(user)
    const isEnrolled = await enrollCollection.find({user,course : {$in : cartList}})
    return !!isEnrolled[0]
}