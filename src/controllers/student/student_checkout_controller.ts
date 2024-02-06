import asyncHandler from "express-async-handler"
import mongoose from "mongoose";
import { Request, Response } from "express";
import { isNumber } from "../../type_check/number";
import { fetchCartDetails, fetchCartTotal } from "../../utility/cart_details_fetch";
import courseCollection from "../../models/course_model";
import { enrollCartItems, enrollSingleCourse } from "../../utility/checkout_helper";
import { isCartItemsEnrolled, isCourseEnrolledHelper } from "../../utility/enroll_check_helper";

export const checkOut = asyncHandler(async (req: any, res: Response) => {
    const { amount, isCart, course_id } = req.body

    const user_id = new mongoose.Types.ObjectId(req.user._id)

    // this defines the order is for cart or single product
    let checkOutFor: 'cart' | 'single';

    if (!isNumber(amount)) throw new Error('invalid amount')
    if (isCart === true) {

        const cartDetails = await fetchCartDetails(user_id)
        if (!cartDetails) throw new Error('no cart has founded');

        const isCartEnrolled = await isCartItemsEnrolled(user_id)
        if (isCartEnrolled) throw new Error('cart item have already enrolled')

        const total = fetchCartTotal(cartDetails)
        if (total === null) throw new Error('no cart total');
        if (total !== amount) throw new Error('amount does not matches')

        checkOutFor = 'cart'

    } else {

        const isEnrolledCourse = await isCourseEnrolledHelper(course_id, req.user_id)
        if (isEnrolledCourse) throw new Error('course have already enrolled')

        const isExist = await courseCollection.findById(course_id)
        if (!isExist) throw new Error('not such course exists')
        if (isExist.fee !== amount) throw new Error('amount does not matches')

        checkOutFor = 'single'
    }

    if (!checkOutFor) throw new Error('checkout method is not specified')
    
    let enid !: boolean | string;

    if (checkOutFor === 'cart') {
        enid = await enrollCartItems(user_id, amount)
        if (!enid) throw new Error('failed to enroll cart items try later')
    }

    if (checkOutFor === 'single') {
        enid = await enrollSingleCourse(user_id, course_id, amount)
        if (!enid) throw new Error('failed to enroll course try later')
    }

    const isEnrolled = amount === 0

    // the course will be enrolled if the course is free
    if (isEnrolled) {
        res.json({ success: true , enid })
    }

    // if the course is paid will redirect to payment page
    res.redirect(`/student/payment?amount=${amount}&enrollId=${enid}`)

})