import asyncHandler from "express-async-handler"
import mongoose from "mongoose";
import { Response, Request } from "express";
import cartCollection from "../../models/user_cart_model";
import courseCollection from "../../models/course_model";
import { fetchCartDetails, fetchCartItemList, fetchCartTotal } from "../../utility/cart_details_fetch";
import { fetechEnrollCategory } from "../../utility/fetch_enroll_list_category";
import { isCourseEnrolledHelper } from "../../utility/enroll_check_helper";
import { JWTStudentReq } from "../../types/express_req_res";
import { mongoId } from "../../types/mongoose_type";
import { CartItemListType } from "../../types/cart_type";

export const addToCart = asyncHandler(async (request: Request, res: Response) => {

    const req = request as JWTStudentReq
    const { id } = req.params
    const user_id = new mongoose.Types.ObjectId(req.user._id)

    const isCourseExist = await courseCollection.findById(id)
    if (!isCourseExist) throw new Error('invalid course id')

    const cart = await cartCollection.findOne({ user: user_id })
    // if cart exists add the course_id in the existing course list in cart

    const check = await isCourseEnrolledHelper(id, req.user._id)
    if (check) throw new Error('course already enrolled');

    if (cart) {
        const courseList: mongoId[] = cart.course
        courseList.forEach(each => {
            if (each.equals(id)) throw new Error('course have already added in the cart');
        })
       
        cart.course = [...courseList,isCourseExist._id]
        await cart.save()
    }
    // else there is no cart new cart will be created
    else {
        const newCartItem = await cartCollection.create({
            user: user_id,
            course: [isCourseExist._id]
        })
    }

    res.json({ msg: 'succsessfully added to cart' })

})


export const removeFromCart = asyncHandler(async (req: any, res) => {


    const { id } = req.params
    const user_id = new mongoose.Types.ObjectId(req.user._id)

    const isCourseExist = await courseCollection.findById(id)
    if (!isCourseExist) throw new Error('invalid course id')

    const cart = await cartCollection.findOne({ user: user_id })
    if (!cart) throw new Error('no cart exist for the user')

    const courseList: mongoId[] = cart.course.slice()
    const filteredCourse = courseList.filter(each => {
        if (!each.equals(id)) { return each } ;
    })
    cart.course = filteredCourse
    await cart.save()
    res.json({ msg: 'item removed from cart successfully' })

})


export const getCartDetails = asyncHandler(async (req: any, res) => {

    const user_id = new mongoose.Types.ObjectId(req.user._id)

    const cartDetails: CartItemListType[] | null = await fetchCartDetails(user_id)

    if (!cartDetails || !cartDetails[0]) {
        res.json({ success: false })
    } else {
        const total = fetchCartTotal(cartDetails)
        if (total === null) throw new Error('no cart total');

        res.json({ success  :true, cartItems: cartDetails[0].course, cartTotal: total })
    }
})


export const cartList = asyncHandler(async (req: any, res) => {

    const user_id = new mongoose.Types.ObjectId(req.user._id)
    const cartList = await fetchCartItemList(user_id)
    res.json({ cartList })

})

export const getEnrollSubCat = asyncHandler(async (req: any, res) => {

    const user_id = new mongoose.Types.ObjectId(req.user._id)
    const subCatObj = await fetechEnrollCategory(user_id)

    res.json({ subCatObj })
})

