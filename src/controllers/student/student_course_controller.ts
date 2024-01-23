import asyncHandler from "express-async-handler"
import mongoose from "mongoose";
import { Response, Request } from "express";
import cartCollection from "../../models/user_cart_model.ts";
import courseCollection from "../../models/course_model.ts";
import { CartItem } from "../../types/cart_type.ts";

export const addToCart = asyncHandler(async (req: any, res : Response) => {
    const {id} = req.params
    const courseId = new mongoose.Types.ObjectId(id)  
    const user_id = new mongoose.Types.ObjectId(req.user._id)

    const isCourseExist = await courseCollection.findById(id)
    if (!isCourseExist) throw new Error('invalid course id')

    const cart = await cartCollection.findOne({ user: user_id })

    // if cart exists add the course_id in the existing course list in cart

    if (cart) {
        const courseList: CartItem[]= cart.course
        courseList.forEach(each =>
            {

               if( each.course_id.equals(id)){
                   throw new Error ('course have already added in the cart');
               }
            })
        const newCourse: CartItem = { course_id: isCourseExist._id, quantity: 1 };

        cart.course = [...courseList,newCourse]
        await cart.save()
    }
    // else there is no cart new cart will be created
    else{
        console.log('else cart')
        const newCartItem = await cartCollection.create({
            user : user_id,
            course : [{course_id : id, quantity: 1}]
        })
    }

    res.json({msg : 'succsessfully added to cart'})

})

