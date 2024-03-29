
import cartCollection from "../models/user_cart_model.js"
import mongoose from "mongoose"
import { mongoId } from "../types/mongoose_type.js";
import { CartCourseType, CartItemListType } from "../types/cart_type.js";

// this function calculates the total amout of cart items in a user cart 
export const fetchCartTotal = (cartDetails: CartItemListType[]): number | null => {
    const total = cartDetails[0].course.reduce((acc: number, each: CartCourseType) => {
        return acc + each.details[0].fee
    }, 0)

    if (isNaN(total)) return null;

    return total
}

export const fetchCartItemList = async (user : mongoId) =>{
    const userCart = await cartCollection.findOne({user})
    let cartList : mongoId[]
    if(userCart){
        cartList = userCart?.course
    }else{
         cartList = []
    }
    return cartList
}


// this function will provide the user cart details
export const fetchCartDetails = async (id: mongoose.Types.ObjectId): Promise<any> => {
    try {
        const cartDetails: CartItemListType[] = await cartCollection.aggregate([
            {
                $match: {
                    user: id
                }
            },
            {
                $unwind: "$course"
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    course: {
                        course_id: "$course",
                        details: "$courseDetails"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    user: { $first: "$user" },
                    course: { $push: "$course" }
                }

            }
        ])

        return cartDetails
    } catch (e) {
        console.log(e)
        return(null)
    }
}

