import asyncHandler from "express-async-handler"
import mongoose from "mongoose";
import { Response, Request } from "express";
import cartCollection from "../../models/user_cart_model.ts";
import courseCollection from "../../models/course_model.ts";
import { CartCourseType, CartItem } from "../../types/cart_type.ts";

export const addToCart = asyncHandler(async (req: any, res : Response) => {
    const {id} = req.params  
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
        const newCourse: CartItem = { course_id: isCourseExist._id };

        cart.course = [...courseList,newCourse]
        await cart.save()
    }
    // else there is no cart new cart will be created
    else{
        const newCartItem = await cartCollection.create({
            user : user_id,
            course : [{course_id : id}]
        })
    }

    res.json({msg : 'succsessfully added to cart'})

})


export const removeFromCart = asyncHandler(async(req : any,res)=>{
    console.log('cart remove')
    const {id} = req.params
    const user_id = new mongoose.Types.ObjectId(req.user._id)

    const isCourseExist = await courseCollection.findById(id)
    if (!isCourseExist) throw new Error('invalid course id')

    const cart = await cartCollection.findOne({ user: user_id })
    if(!cart) throw new Error('no cart exist for the user')

    const courseList: CartItem[]= cart.course.slice()
    const filteredCourse = courseList.filter(each => {
        if(!each.course_id.equals(id)){
            return each
        }
    })
    cart.course = filteredCourse
    await cart.save()
    res.json({msg : 'item removed from cart successfully'})
    
})


export const getCartDetails = asyncHandler( async (req : any, res)=>{
    const user_id  = new mongoose.Types.ObjectId(req.user._id)

    const cartDetails : any = await cartCollection.aggregate([
        {
            $match: {
                user : user_id
            }
        },
        {
            $unwind: "$course"
        },
        {
            $lookup: {
                from: "courses", 
                localField: "course.course_id",
                foreignField: "_id",
                as: "courseDetails"
            }
        },
        {
            $project: {
                _id: 1, 
                user: 1,
                course: {
                    course_id: "$course.course_id",
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

    const total = cartDetails[0].course.reduce((acc : number,each : CartCourseType)=>{
        return acc + each.details[0].fee
    },0)

    if(isNaN(total)) throw new Error ('no cart total');
    if(!cartDetails) throw new Error ('no cart has founded');
    
    res.json({cartItems : cartDetails[0].course , cartTotal : total })

})


export const cartList = asyncHandler( async (req : any,res)=>{
    
    const user_id  = new mongoose.Types.ObjectId(req.user._id)
    const userCart = await cartCollection.findOne({user : user_id})
    let cartList
    if(userCart) {
       cartList = userCart.course.map((each : CartItem) => each.course_id)
    }
    res.json({cartList})
})

